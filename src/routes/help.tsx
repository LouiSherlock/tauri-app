import { createFileRoute } from "@tanstack/react-router";

import { List, ListItem } from "@astryxdesign/core/List";
import { VStack } from "@astryxdesign/core/VStack";

export const Route = createFileRoute("/help")({
  component: HelpPage,
});

function HelpPage() {
  return (
    <VStack padding={4}>
      <List density="spacious" hasDividers>
        <ListItem
          label="How do I change the appearance?"
          description="Open Profile → Settings and choose System, Light, or Dark."
        />
        <ListItem
          label="How do I use the greeting?"
          description="Go to Home, enter a name, then select Greet."
        />
        <ListItem
          label="Why is the content inset from the screen edges?"
          description="The app keeps controls clear of the Android status bar, display cutout, and navigation area."
        />
      </List>
    </VStack>
  );
}
