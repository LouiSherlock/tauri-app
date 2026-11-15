import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "@astryxdesign/core/Heading";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { ThemeSwitcher } from "../components/theme-switcher";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <VStack gap={4} padding={4}>
      <Section padding={4} dividers={["bottom"]}>
        <VStack gap={3}>
          <VStack gap={1}>
            <Heading level={5}>Appearance</Heading>
            <Text type="supporting" color="secondary">
              Choose a theme or follow your device setting.
            </Text>
          </VStack>
          <ThemeSwitcher />
        </VStack>
      </Section>
    </VStack>
  );
}
