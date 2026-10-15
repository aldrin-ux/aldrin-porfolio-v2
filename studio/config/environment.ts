// Use static references: Sanity replaces SANITY_STUDIO_* values in browser builds.
function readEnvironment() {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET;

  if (!projectId || !dataset) {
    throw new Error("Missing Studio public identifiers. Copy studio/.env.example to studio/.env.local.");
  }

  if (projectId !== "p9xrr86a" || !["production", "ald118-test"].includes(dataset)) {
    throw new Error("This Studio setup accepts only p9xrr86a production or the isolated ald118-test dataset.");
  }

  return { projectId, dataset };
}

export const { projectId, dataset } = readEnvironment();
