import type { StructureResolver } from "sanity/structure";
import { SetupNotice } from "./components/setup-notice";

const Guidance = () => <SetupNotice title="Editing and review" description="This Studio targets the production dataset. No content migration or publishing is authorized yet. Reusable sections live inside pages; image rights and facts need review. Schema validation is not account access control or proof of permission." />;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio V2 CMS")
    .items([
      S.listItem().id("site-settings").title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().id("profile").title("Portfolio profile").child(S.document().schemaType("portfolioProfile").documentId("portfolioProfile")),
      S.listItem().id("navigation").title("Navigation").child(S.document().schemaType("navigation").documentId("navigation-primary")),
      S.divider(),
      S.documentTypeListItem("page").title("Website pages"),
      S.documentTypeListItem("project").title("Projects and case studies"),
      S.documentTypeListItem("professionalExperience").title("Professional experience"),
      S.divider(),
      S.listItem().id("editing-guidance").title("Editing and review").child(S.component().id("editing-guidance").title("Editing and review").component(Guidance)),
    ]);
