# Document schemas

`models.ts` implements the six ALD-114 document types: siteSettings, portfolioProfile, project, professionalExperience, navigation and page. Case studies are embedded in project; ordinary IDs are generated, and only the three shared singletons use explicit IDs. These are schema definitions only; no documents have been created or migrated. See `docs/ALD-116_VERIFICATION.md` in the repository root for field coverage and enforcement limits.
