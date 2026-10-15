import { defineArrayMember, defineType } from "sanity";
import { portableTextRules } from "../validation.ts";

export const portableText = defineType({
  name: "portableText", title: "Narrative text", type: "array",
  of: [defineArrayMember({ type: "block", styles: [{ title: "Paragraph", value: "normal" }], lists: [],
    marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Emphasis", value: "em" }], annotations: [defineArrayMember({ type: "link" })] },
  })],
  validation: r => r.required().min(1).custom(portableTextRules).error(),
});
