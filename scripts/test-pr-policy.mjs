import assert from 'node:assert/strict';
import test from 'node:test';
import { sizeExceptionRationale, validatePolicy } from './validate-pr-policy.mjs';

function issueBody(impact = 'Documentation change required', evidence = 'Policy behavior and fixtures change together.') {
  return `### Delivery impact

${impact}

### Impact evidence

${evidence}`;
}

function request(overrides = {}) {
  return {
    additions: 20,
    author: 'contributor',
    baseRef: 'develop',
    body: `Closes #41

## Delivery Impact

- Documentation: updated
- Public API: unchanged
- Migration: not required
- Compatibility: unchanged
- Release notes: not required
- Evidence: Policy behavior and fixtures change together.`,
    deletions: 5,
    headRef: 'fix/review-budget-exceptions',
    ...overrides,
  };
}

test('accepts an ordinary approved work unit within budget', () => {
  const result = validatePolicy({
    pullRequest: request(),
    labels: ['status:approved', 'type:bug'],
    linkedIssueApproved: true,
    linkedIssueBody: issueBody(),
  });
  assert.equal(result.changedLines, 25);
  assert.equal(result.exception, false);
});

test('rejects an over-budget work unit without an exception', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ additions: 401 }),
      labels: ['type:bug'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
    }),
    /review budget is 400/,
  );
});

test('requires a concrete rationale for the exception label', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ additions: 401, body: `${request().body}\n\n## Size exception rationale\n\n_Not applicable._` }),
      labels: ['size:exception', 'type:bug'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
      exceptionPermission: 'admin',
    }),
    /no Size exception rationale/,
  );
});

test('requires administrator authority for an exception', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ additions: 401, body: `${request().body}\n\n## Size exception rationale\n\nGenerated lockfile is indivisible.` }),
      labels: ['size:exception', 'type:bug'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
      exceptionPermission: 'write',
    }),
    /repository administrator/,
  );
});

test('accepts a documented administrator-approved exception', () => {
  const result = validatePolicy({
    pullRequest: request({ additions: 401, body: `${request().body}\n\n## Size exception rationale\n\nGenerated lockfile is indivisible.` }),
    labels: ['size:exception', 'type:bug'],
    linkedIssueApproved: true,
    linkedIssueBody: issueBody(),
    exceptionPermission: 'admin',
  });
  assert.equal(result.exception, true);
});

test('keeps promotions exempt from the review budget', () => {
  const result = validatePolicy({
    pullRequest: request({ additions: 1000, baseRef: 'main', headRef: 'develop' }),
    labels: ['type:chore'],
    linkedIssueApproved: true,
    linkedIssueBody: issueBody(),
  });
  assert.equal(result.promotion, true);
  assert.equal(result.exception, false);
});

test('extracts only a populated rationale section', () => {
  assert.equal(sizeExceptionRationale('## Size exception rationale\n\nGenerated output cannot be split.\n\n## Verification\nOK'), 'Generated output cannot be split.');
  assert.equal(sizeExceptionRationale('## Size exception rationale\n\n_No response_'), '');
});

test('requires structured delivery impact for human changes', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ body: 'Closes #42' }),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
    }),
    /Delivery Impact section/,
  );
});

test('rejects placeholder impact choices and evidence', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ body: request().body.replace('Documentation: updated', 'Documentation: updated or not required') }),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
    }),
    /classify Documentation/,
  );
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ body: request().body.replace('Policy behavior and fixtures change together.', 'N/A') }),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
    }),
    /concrete Evidence/,
  );
});

test('rejects duplicate PR impact fields and sections', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ body: request().body.replace('- Evidence:', '- Documentation: not required\n- Evidence:') }),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
    }),
    /exactly one Documentation classification/,
  );
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ body: `${request().body}\n\n## Delivery Impact\n\n${request().body}` }),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody(),
    }),
    /exactly one Delivery Impact section/,
  );
});

test('rejects contradictory issue impact and issue-PR disagreement', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request(),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody('Documentation change required\nNo user-facing impact'),
    }),
    /cannot combine No user-facing impact/,
  );
  assert.throws(
    () => validatePolicy({
      pullRequest: request(),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody('No user-facing impact'),
    }),
    /Documentation disagrees/,
  );
});

test('requires exact Issue Form impact options', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request(),
      labels: ['type:feature'],
      linkedIssueApproved: true,
      linkedIssueBody: issueBody('Documentation change requiredness'),
    }),
    /invalid Delivery impact/,
  );
});

test('keeps generated Dependabot bodies exempt from delivery metadata', () => {
  const result = validatePolicy({
    pullRequest: request({ author: 'dependabot[bot]', body: 'Generated dependency update.', headRef: 'dependabot/npm_and_yarn/develop/example-1.0.0' }),
    labels: ['type:chore'],
  });
  assert.equal(result.automation, true);
  assert.equal(result.impact, undefined);
});
