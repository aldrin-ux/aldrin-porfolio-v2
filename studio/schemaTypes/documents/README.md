# Document schemas

`models.ts` implements the six ALD-114 document types: siteSettings, portfolioProfile, project, professionalExperience, navigation and page. Case studies are embedded in project; ordinary IDs are generated, and only the three shared singletons use explicit IDs. The isolated test Studio selects a small view of the existing project fields. One synthetic editing test passed in `ald118-test`; production content has not been migrated. See [current setup and content contract](../../../docs/SANITY_SETUP.md) for supported modes and enforcement limits.
