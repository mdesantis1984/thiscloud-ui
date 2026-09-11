import assert from 'node:assert/strict';
import test from 'node:test';
import { sizeExceptionRationale, validatePolicy } from './validate-pr-policy.mjs';

function request(overrides = {}) {
  return {
    additions: 20,
    author: 'contributor',
    baseRef: 'develop',
    body: 'Closes #41',
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
    }),
    /review budget is 400/,
  );
});

test('requires a concrete rationale for the exception label', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ additions: 401, body: 'Closes #41\n\n## Size exception rationale\n\n_Not applicable._' }),
      labels: ['size:exception', 'type:bug'],
      linkedIssueApproved: true,
      exceptionPermission: 'admin',
    }),
    /no Size exception rationale/,
  );
});

test('requires administrator authority for an exception', () => {
  assert.throws(
    () => validatePolicy({
      pullRequest: request({ additions: 401, body: 'Closes #41\n\n## Size exception rationale\n\nGenerated lockfile is indivisible.' }),
      labels: ['size:exception', 'type:bug'],
      linkedIssueApproved: true,
      exceptionPermission: 'write',
    }),
    /repository administrator/,
  );
});

test('accepts a documented administrator-approved exception', () => {
  const result = validatePolicy({
    pullRequest: request({ additions: 401, body: 'Closes #41\n\n## Size exception rationale\n\nGenerated lockfile is indivisible.' }),
    labels: ['size:exception', 'type:bug'],
    linkedIssueApproved: true,
    exceptionPermission: 'admin',
  });
  assert.equal(result.exception, true);
});

test('keeps promotions exempt from the review budget', () => {
  const result = validatePolicy({
    pullRequest: request({ additions: 1000, baseRef: 'main', body: 'Closes #41', headRef: 'develop' }),
    labels: ['type:chore'],
    linkedIssueApproved: true,
  });
  assert.equal(result.promotion, true);
  assert.equal(result.exception, false);
});

test('extracts only a populated rationale section', () => {
  assert.equal(sizeExceptionRationale('## Size exception rationale\n\nGenerated output cannot be split.\n\n## Verification\nOK'), 'Generated output cannot be split.');
  assert.equal(sizeExceptionRationale('## Size exception rationale\n\n_No response_'), '');
});
