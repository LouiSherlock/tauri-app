import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/VStack";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useSystemInsets } from "../hooks/use-system-insets";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const insets = useSystemInsets();
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <>
      <Card padding={4}>
        <VStack gap={2}>
          <Heading level={4}>Edge-to-edge</Heading>
          <Text type="body" color="secondary">
            The page background reaches the bottom of the screen, while the
            header and tab bar keep their content inside the system bars.
          </Text>
          <Text type="code" color="secondary">
            {`safe-top ${insets.top}px · safe-bottom ${insets.bottom}px`}
          </Text>
        </VStack>
      </Card>

      <Card padding={4}>
        <VStack gap={3}>
          <Heading level={4}>Native bridge</Heading>
          <TextInput
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Enter a name..."
          />
          <Button label="Greet" variant="primary" onClick={greet} />
          {greetMsg ? <Text type="body">{greetMsg}</Text> : null}
        </VStack>
      </Card>
    </>
  );
}
