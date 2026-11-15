import { createFileRoute } from "@tanstack/react-router";

import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

export const Route = createFileRoute("/discover")({
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <Card padding={4}>
      <VStack gap={2}>
        <Heading level={4}>Discover</Heading>
        <Text type="body" color="secondary">
          This is the Discover tab. Its page is routed from
          <code>src/routes/discover.tsx</code>.
        </Text>
      </VStack>
    </Card>
  );
}
