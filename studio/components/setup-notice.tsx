import { Card, Heading, Stack, Text } from "@sanity/ui";
import { projectId, dataset } from "../config/environment";

export function SetupNotice({ title, description }: { title: string; description: string }) {
  return (
    <Card padding={5} height="fill">
      <Stack gap={4}>
        <Heading as="h1" size={2}>{title}</Heading>
        <Text>{description}</Text>
        <Text muted>This area is reserved for the reviewed content model. No editable document types or sample content have been created.</Text>
        <Text size={1} muted>Project: {projectId} · Dataset: {dataset}</Text>
      </Stack>
    </Card>
  );
}
