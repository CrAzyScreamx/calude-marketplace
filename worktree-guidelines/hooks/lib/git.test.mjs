// Self-check for git.mjs. Run: node hooks/lib/git.test.mjs  (must be inside a git repo)
import assert from 'node:assert';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { headSha, isAncestor, markerSha, writeMarker } from './git.mjs';

const sha = headSha();
assert.match(sha, /^[0-9a-f]{40}$/, 'headSha should be a 40-char hex SHA');

// A commit is always its own ancestor; a nonexistent SHA never is.
assert.equal(isAncestor(sha, sha), true, 'HEAD is an ancestor of itself');
assert.equal(isAncestor('0'.repeat(40), sha), false, 'bogus SHA is not an ancestor');

// Marker round-trips through an isolated temp root.
const root = mkdtempSync(join(tmpdir(), 'wt-marker-'));
assert.equal(markerSha(root), '', 'no marker → empty');
const written = writeMarker(root);
assert.equal(written, sha, 'writeMarker returns the HEAD it wrote');
assert.equal(markerSha(root), sha, 'marker reads back what was written');

console.log('ok');
