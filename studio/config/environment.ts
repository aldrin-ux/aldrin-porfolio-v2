// Use static references: Sanity replaces SANITY_STUDIO_* values in browser builds.
function readEnvironment() {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET;

  if (!projectId || !dataset) {
    throw new Error("Missing Studio public identifiers. Copy studio/.env.example to studio/.env.local.");
  }

  if (projectId !== "p9xrr86a" || dataset !== "production") {
    throw new Error("This Studio setup is scoped to Sanity project p9xrr86a and dataset production.");
  }

  return { projectId, dataset };
}

export const { projectId, dataset } = readEnvironment();
