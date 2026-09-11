import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const branchPattern = /^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$/;
const exceptionLabel = 'size:exception';

function fail(message) {
  throw new Error(message);
}

export function classifyFlow({ author, baseRef, headRef }) {
  if (author === 'dependabot[bot]' && baseRef === 'develop' && headRef.startsWith('dependabot/')) {
    return { automation: true, promotion: false };
  }
  if (baseRef === 'main' && headRef === 'develop') {
    return { automation: false, promotion: true };
  }
  if (baseRef === 'main' && /^fix\/[a-z0-9._-]+$/.test(headRef)) {
    return { automation: false, promotion: false };
  }
  if (baseRef === 'develop' && branchPattern.test(headRef)) {
    return { automation: false, promotion: false };
  }
  fail(`Invalid branch flow: ${headRef} -> ${baseRef}`);
}

export function issueReference(body) {
  return body.match(/(?:closes|fixes|resolves)\s+#(\d+)/i)?.[1];
}

export function sizeExceptionRationale(body) {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => /^#{1,6}\s+size exception rationale\s*$/i.test(line));
  if (start < 0) return '';

  const rationale = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,6}\s+/.test(line)) break;
    rationale.push(line);
  }
  const value = rationale.join('\n').trim();
  const normalized = value.replace(/^_+|_+$/g, '').trim();
  return /^(?:not applicable|no response)\.?$/i.test(normalized) ? '' : value;
}

const impactOptions = new Map([
  ['Documentation', ['updated', 'not required']],
  ['Public API', ['changed', 'unchanged']],
  ['Migration', ['required', 'not required']],
  ['Compatibility', ['changed', 'unchanged']],
  ['Release notes', ['required', 'not required']],
]);
const issueImpactOptions = new Map([
  ['Documentation change required', ['Documentation', 'updated']],
  ['Public API change', ['Public API', 'changed']],
  ['Migration required', ['Migration', 'required']],
  ['Compatibility change', ['Compatibility', 'changed']],
  ['Release note required', ['Release notes', 'required']],
]);

function sectionLines(body, heading) {
  const lines = body.split(/\r?\n/);
  const pattern = new RegExp(`^#{1,6}\\s+${heading}\\s*$`, 'i');
  const starts = lines.flatMap((line, index) => pattern.test(line) ? [index] : []);
  if (starts.length !== 1) fail(`PR body must contain exactly one ${heading} section.`);
  const section = [];
  for (const line of lines.slice(starts[0] + 1)) {
    if (/^#{1,6}\s+/.test(line)) break;
    section.push(line);
  }
  return section;
}

export function deliveryImpact(body) {
  const section = sectionLines(body, 'Delivery Impact');
  const impact = {};
  for (const [field, allowed] of impactOptions) {
    const matches = section.filter((line) => new RegExp(`^- ${field}:`, 'i').test(line));
    if (matches.length !== 1) fail(`Delivery Impact must contain exactly one ${field} classification.`);
    const value = matches[0].replace(new RegExp(`^- ${field}:`, 'i'), '').replaceAll('`', '').trim().toLowerCase();
    if (!allowed.includes(value)) fail(`Delivery Impact must classify ${field}: ${allowed.join(' or ')}.`);
    impact[field] = value;
  }
  const evidenceLines = section.filter((line) => /^- Evidence:/i.test(line));
  if (evidenceLines.length !== 1) fail('Delivery Impact must contain exactly one Evidence entry.');
  const evidence = evidenceLines[0].replace(/^- Evidence:/i, '').trim();
  if (!evidence || /^(?:n\/?a|none|not applicable)\.?$/i.test(evidence)) {
    fail('Delivery Impact must include concrete Evidence.');
  }
  return { ...impact, Evidence: evidence };
}

export function issueDeliveryImpact(body) {
  const submitted = sectionLines(body, 'Delivery impact')
    .flatMap((line) => line.split(','))
    .map((value) => value.replace(/^-\s+/, '').trim())
    .filter(Boolean);
  const allowed = new Set([...issueImpactOptions.keys(), 'No user-facing impact']);
  const unknown = submitted.filter((value) => !allowed.has(value));
  if (unknown.length > 0) fail(`Linked issue has invalid Delivery impact: ${unknown.join(', ')}.`);
  const selected = submitted.filter((value) => issueImpactOptions.has(value));
  const noImpact = submitted.includes('No user-facing impact');
  if (selected.length === 0 && !noImpact) fail('Linked issue must classify Delivery impact.');
  if (noImpact && selected.length > 0) fail('Linked issue cannot combine No user-facing impact with another Delivery impact.');

  const impact = {
    Documentation: 'not required',
    'Public API': 'unchanged',
    Migration: 'not required',
    Compatibility: 'unchanged',
    'Release notes': 'not required',
  };
  for (const option of selected) {
    const [field, value] = issueImpactOptions.get(option);
    impact[field] = value;
  }
  const evidence = sectionLines(body, 'Impact evidence').join('\n').trim();
  if (!evidence || /^(?:n\/?a|none|not applicable|_no response_)\.?$/i.test(evidence)) {
    fail('Linked issue must include concrete Impact evidence.');
  }
  return { ...impact, Evidence: evidence };
}

export function validatePolicy({ pullRequest, labels, linkedIssueApproved, linkedIssueBody, exceptionPermission }) {
  const { automation, promotion } = classifyFlow(pullRequest);
  if (!automation && !promotion && !branchPattern.test(pullRequest.headRef)) {
    fail(`Invalid branch name: ${pullRequest.headRef}`);
  }

  const typeLabels = labels.filter((label) => label.startsWith('type:'));
  if (typeLabels.length !== 1) {
    fail(`Expected exactly one type:* label, found ${typeLabels.length}.`);
  }

  let reference = 'Dependabot automation';
  const impact = automation ? undefined : deliveryImpact(pullRequest.body);
  if (!automation) {
    const issueNumber = issueReference(pullRequest.body);
    if (!issueNumber) fail('PR body must contain Closes, Fixes, or Resolves followed by an issue number.');
    if (!linkedIssueApproved) fail(`Linked issue #${issueNumber} does not have status:approved.`);
    const issueImpact = issueDeliveryImpact(linkedIssueBody ?? '');
    for (const field of impactOptions.keys()) {
      if (impact[field] !== issueImpact[field]) {
        fail(`Delivery Impact ${field} disagrees with linked issue #${issueNumber}.`);
      }
    }
    reference = `issue #${issueNumber}`;
  }

  const changedLines = pullRequest.additions + pullRequest.deletions;
  let exception = false;
  if (!promotion && changedLines > 400) {
    if (!labels.includes(exceptionLabel)) {
      fail(`PR has ${changedLines} changed lines; the review budget is 400.`);
    }
    if (!sizeExceptionRationale(pullRequest.body)) {
      fail(`PR has ${changedLines} changed lines and ${exceptionLabel}, but no Size exception rationale.`);
    }
    if (exceptionPermission !== 'admin') {
      fail(`${exceptionLabel} must be applied by a repository administrator.`);
    }
    exception = true;
  }

  return { automation, changedLines, exception, impact, promotion, reference, typeLabel: typeLabels[0] };
}

async function ghJson(args) {
  const { stdout } = await exec('gh', ['api', ...args]);
  return JSON.parse(stdout);
}

async function exceptionPermission(repository, pullRequestNumber) {
  const { stdout } = await exec('gh', [
    'api',
    '--paginate',
    `repos/${repository}/issues/${pullRequestNumber}/events?per_page=100`,
    '--jq',
    `.[] | select((.event == "labeled" or .event == "unlabeled") and .label.name == "${exceptionLabel}") | {event, actor: .actor.login}`,
  ]);
  const events = stdout.trim() ? stdout.trim().split('\n').map(JSON.parse) : [];
  const latest = events.at(-1);
  if (!latest || latest.event !== 'labeled') return undefined;
  const permission = await ghJson([`repos/${repository}/collaborators/${latest.actor}/permission`]);
  return permission.permission;
}

export async function main(env = process.env) {
  const repository = env.REPOSITORY;
  if (!repository || !env.GITHUB_EVENT_PATH) fail('REPOSITORY and GITHUB_EVENT_PATH are required.');

  const event = JSON.parse(await readFile(env.GITHUB_EVENT_PATH, 'utf8'));
  const source = event.pull_request;
  const pullRequest = {
    additions: source.additions,
    author: source.user.login,
    baseRef: source.base.ref,
    body: source.body ?? '',
    deletions: source.deletions,
    headRef: source.head.ref,
  };
  const flow = classifyFlow(pullRequest);
  const labels = await ghJson([`repos/${repository}/issues/${source.number}/labels?per_page=100`]);
  const labelNames = labels.map(({ name }) => name);

  let linkedIssueApproved;
  let linkedIssueBody;
  if (!flow.automation) {
    const issueNumber = issueReference(pullRequest.body);
    if (issueNumber) {
      const issue = await ghJson([`repos/${repository}/issues/${issueNumber}`]);
      linkedIssueApproved = issue.labels.some(({ name }) => name === 'status:approved');
      linkedIssueBody = issue.body ?? '';
    }
  }

  const changedLines = pullRequest.additions + pullRequest.deletions;
  const permission = !flow.promotion && changedLines > 400 && labelNames.includes(exceptionLabel)
    ? await exceptionPermission(repository, source.number)
    : undefined;
  const result = validatePolicy({ pullRequest, labels: labelNames, linkedIssueApproved, linkedIssueBody, exceptionPermission: permission });
  const exception = result.exception ? `, ${exceptionLabel}` : '';
  console.log(`PR policy passed for #${source.number} (${pullRequest.headRef} -> ${pullRequest.baseRef}, ${result.typeLabel}, ${result.changedLines} changed lines, ${result.reference}${exception}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
