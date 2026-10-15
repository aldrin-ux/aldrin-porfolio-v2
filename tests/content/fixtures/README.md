# Offline synthetic content only

`published.json` mirrors approved static wording and the exact PR #10 field contract. IDs, revisions, asset records, timestamps and approval metadata are synthetic. `local-media.json` binds existing local image files for tests; it is not a production permission ledger. No live Content Lake records are read, imported, written or published.

The fifth project helper copies a test record and gives it a clearly synthetic title/route solely to test route generation. It is not a new portfolio entry or factual claim. Test rights and editorial flags do not establish reuse permission, client endorsement or release approval. Real screenshots remain provisional under ALD-101/115/116.

The production Astro config never imports these fixtures or the test policy. Local fixture builds require `CONTENT_SOURCE=sanity CONTENT_INTEGRATION_TEST=1` and `--config tests/content/astro.fixture.config.mjs`; the integration rejects `NETLIFY` for fixture mode. `CONTENT_TEST_INVALID=1` exercises a malformed snapshot stopping the build. All outputs remain ignored under `test-results/` and `.cache/`.
