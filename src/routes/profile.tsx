import { createFileRoute } from "@tanstack/react-router";

import { Icon } from "@astryxdesign/core/Icon";
import { Heading } from "@astryxdesign/core/Heading";
import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <VStack gap={3} padding={4}>
      <VStack gap={1}>
        <Heading level={4}>Profile</Heading>
        <Text type="body" color="secondary">
          App preferences and information.
        </Text>
      </VStack>
      <List density="spacious" hasDividers>
        <ListItem
          label="Settings"
          description="Appearance and display preferences"
          href="/settings"
          endContent={<Icon icon="chevronRight" color="secondary" />}
        />
        <ListItem
          label="Help"
          description="Answers to common questions"
          href="/help"
          endContent={<Icon icon="chevronRight" color="secondary" />}
        />
        <ListItem
          label="About"
          description="App and build information"
          href="/about"
          endContent={<Icon icon="chevronRight" color="secondary" />}
        />
      </List>
      <div className="h-[1200px]">

      </div>
    </VStack>
  );
}
