import type { StructureResolver } from "sanity/structure";
import { SetupNotice } from "./components/setup-notice";

const sections = [
  { id: "site-settings", title: "Site settings", description: "Site-wide settings will be defined after content-model review." },
  { id: "projects", title: "Projects and case studies", description: "Project attribution, case-study content and image permission fields will be modeled in later issues." },
  { id: "experience", title: "Professional experience", description: "Verified professional history will be modeled without inventing dates or responsibilities." },
  { id: "content-blocks", title: "Reusable content blocks", description: "Shared content objects and blocks will be defined after the schema plan is approved." },
].map((section) => ({
  ...section,
  component: () => <SetupNotice title={section.title} description={section.description} />,
}));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio V2 CMS")
    .items(sections.map((section) =>
      S.listItem()
        .id(section.id)
        .title(section.title)
        .child(S.component().id(section.id).title(section.title).component(section.component))
    ));
