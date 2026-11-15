import { createFileRoute } from "@tanstack/react-router";

import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <VStack gap={3} padding={4}>
      <Text type="body" color="secondary">
        A cross-platform app built with Tauri, React, and Astryx.
      </Text>
      <List density="balanced" hasDividers>
        <ListItem label="Platform" description="Tauri 2" />
        <ListItem label="Interface" description="React + TypeScript" />
        <ListItem label="Design system" description="Astryx" />
      </List>
    </VStack>
  );
}
