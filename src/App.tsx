import "@mantine/core/styles.css";
import {
  AppShell,
  Select,
  Group,
  Modal,
  Textarea,
  Title,
  Text,
  Image,
  MantineProvider,
  Stack,
  Button,
  CopyButton,
  Space,
  Box,
  Divider,
} from "@mantine/core";

import "@mantine/notifications/styles.css";
import figure from "./figure.png";

import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";
import { useLLMQueryStore } from "./LLM/store";
import { useState } from "react";
import { models } from "./LLM/model/LLMModel";
import { defaultGeneQuery } from "./LLM/model/GeneQuery";

export default function App() {
  const llmStore = useLLMQueryStore();
  const [showPromptModal, setShowPromptModal] = useState(false);
  const LLMResult = useLLMQueryStore((state) => state.LLMResult);
  const setLLMResult = useLLMQueryStore((state) => state.setLLMResult);
  const [cancelController, setCancelController] = useState<AbortController>(
    new AbortController()
  );

  const runGeneQuery = async () => {
    llmStore.setLoading(true);
    llmStore.setLLMResult("");
    try {
      const message = llmStore.LLMTemplate.fn(llmStore.geneQuery);
      const response = await llmStore.LLMModel.runQuery(message);
      let result = "";

      switch (llmStore.LLMModel.displayName) {
        case "GPT-4 2023-11-06 Preview": {
          setCancelController(response.controller);
          for await (const chunk of response) {
            const nextContentChunk = chunk.choices[0]?.delta?.content ?? "";
            if (nextContentChunk !== "") {
              result += nextContentChunk;
              setLLMResult(result);
            }
          }
          break;
        }
        case "GPT-3.5 Turbo 2023-11-06": {
          setCancelController(response.controller);
          for await (const chunk of response) {
            const nextContentChunk = chunk.choices[0]?.delta?.content ?? "";
            if (nextContentChunk !== "") {
              result += nextContentChunk;
              setLLMResult(result);
            }
          }
          break;
        }
        case "Gemini-Pro": {
          for await (const chunk of response) {
            const chunkText = chunk.text();
            if (chunkText !== "") {
              result += chunkText;
              setLLMResult(result);
            }
          }
          break;
        }
        case "Mixtral Instruct (Slow)": {
          const { stream, abortController } = response;
          setCancelController(abortController);
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          const reader = stream.body.getReader();

          while (true) {
            const { done, value: chunk } = await reader.read();

            if (done) {
              break;
            }

            buffer += decoder.decode(chunk);

            const parts = buffer.split("\n");

            buffer = parts.pop() ?? "";

            for (const part of parts) {
              try {
                const partObj = JSON.parse(part);
                result += partObj.message.content;
                setLLMResult(result);
              } catch (error) {
                console.warn("invalid json: ", part);
              }
            }
          }

          for (const part of buffer.split("\n").filter((p) => p !== "")) {
            try {
              const partObj = JSON.parse(part);
              result += partObj?.message?.content;
              setLLMResult(result);
            } catch (error) {
              console.warn("invalid json: ", part);
            }
          }

          break;
        }
        case "Llama 2 70b (Slow)": {
          const { stream, abortController } = response;
          setCancelController(abortController);
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          const reader = stream.body.getReader();
          while (true) {
            const { done, value: chunk } = await reader.read();

            if (done) {
              break;
            }

            buffer += decoder.decode(chunk);

            const parts = buffer.split("\n");

            buffer = parts.pop() ?? "";

            for (const part of parts) {
              try {
                const partObj = JSON.parse(part);
                result += partObj.message.content;
                setLLMResult(result);
              } catch (error) {
                console.warn("invalid json: ", part);
              }
            }
          }

          for (const part of buffer.split("\n").filter((p) => p !== "")) {
            try {
              const partObj = JSON.parse(part);
              result += partObj?.message?.content;
              setLLMResult(result);
            } catch (error) {
              console.warn("invalid json: ", part);
            }
          }
          break;
        }
      }
    } catch (e: any) {
      if (!(e instanceof DOMException)) {
        Notifications.show({
          color: "red",
          title: "Error",
          message: `Unable to load LLM response. ${
            e.message as string
          }.  Please try again later.`,
          autoClose: 5000,
        });
      }
      llmStore.setLoading(false);
      throw e;
    }

    llmStore.setLoading(false);
  };

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <AppShell header={{ height: 60 }} withBorder={false} padding="0">
        <AppShell.Header color="white" bg="#252528">
          <Group h="100%" px="md" justify="flex-end">
            <Title style={{ color: "white", fontWeight: 300 }} order={4}>
              UC San Diego - Ideker Lab
            </Title>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Group
            wrap={"nowrap"}
            p={"lg"}
            pb={"md"}
            pt="md"
            justify="space-between"
          >
            <Group wrap="nowrap">
              <Stack gap={0} align="center">
                <Group w={200} gap={0} wrap="nowrap" mr="md">
                  <Title
                    fw={500}
                    size={80}
                    order={1}
                    style={{
                      fontFamily: "comfortaa, Varela round, Quicksand Medium",
                    }}
                  >
                    GS
                  </Title>
                  <Title
                    fw={500}
                    size={80}
                    order={1}
                    c="#cd4025"
                    style={{
                      fontFamily: "comfortaa, Varela round, Quicksand Medium",
                    }}
                  >
                    AI
                  </Title>
                </Group>
                <Title
                  fw={480}
                  mt={-20}
                  w={200}
                  order={2}
                  size={30.4}
                  style={{
                    fontFamily: "comfortaa, Varela round, Quicksand Medium",
                  }}
                >
                  Gene Set AI
                </Title>
              </Stack>
              <Text lineClamp={2} w="35%">
                A tool for gene set analysis with Large Language Models (LLMs)
              </Text>
            </Group>
            <Image radius="md" h={90} w="auto" fit="contain" src={figure} />
          </Group>
          <Group bg="#6D9EEB" p="lg" align="flex-start" justify="space-between">
            <Stack w="35%">
              <Box mih={40}>
                <Text h="sm" style={{ color: "white" }} fw="bold">
                  Try a gene set query:
                </Text>
              </Box>
              <Box>
                <Textarea
                  maxLength={1000}
                  disabled={llmStore.loading}
                  size="sm"
                  onChange={(e) => llmStore.setGeneQuery(e.target.value)}
                  placeholder=""
                  value={llmStore.geneQuery}
                />
                <Space h="sm"></Space>
                <Group justify="space-between" align="flex-start">
                  <Button
                    color="#FF9830"
                    onClick={() => llmStore.setGeneQuery(defaultGeneQuery)}
                    loading={llmStore.loading}
                  >
                    Example Query
                  </Button>
                  <Stack gap="sm">
                    <Button
                      color="#FF9830"
                      onClick={() => runGeneQuery()}
                      loading={llmStore.loading}
                      disabled={llmStore.geneQuery === ""}
                    >
                      Run Query
                    </Button>
                    <Button
                      color="#FF9830"
                      onClick={() => {
                        cancelController.abort();
                        llmStore.setLoading(false);
                      }}
                      disabled={!llmStore.loading}
                    >
                      Stop Generating
                    </Button>
                  </Stack>
                </Group>
              </Box>
              <Box pl="sm">
                <Text c="white">
                  LLM self-assessed confidence interpretation:
                </Text>
                <Space h="sm"></Space>
                <Group>
                  <Text c="white" w={145}>
                    High confidence:
                  </Text>
                  <Text c="white"> 0.87–1.00</Text>
                </Group>
                <Group>
                  <Text c="white" w={145}>
                    Medium confidence:
                  </Text>
                  <Text c="white"> 0.82–0.86</Text>
                </Group>
                <Group>
                  <Text c="white" w={145}>
                    Low confidence:
                  </Text>
                  <Text c="white"> 0.01–0.81</Text>
                </Group>
                <Group>
                  <Text c="white" w={145}>
                    Name not assigned:
                  </Text>
                  <Text c="white"> 0</Text>
                </Group>
              </Box>
              <Box mt={100}>
                <Text c="white">
                  This tool is introduced in Hu et al.,{" "}
                  <a
                    style={{ color: "yellow" }}
                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10543283"
                    target="_blank"
                  >
                    Evaluation of large language models for discovery of gene
                    set function
                  </a>
                  . Code available on{" "}
                  <a
                    target="_blank"
                    style={{ color: "yellow" }}
                    href="https://github.com/idekerlab/llm_evaluation_for_gene_set_interpretation"
                  >
                    GitHub
                  </a>
                  {"."}
                </Text>
              </Box>
            </Stack>
            <Stack w="60%">
              <Box mih={40}>
                <Group>
                  <Text style={{ color: "white" }} fw="bold">
                    Select Model
                  </Text>
                  <Select
                    allowDeselect={false}
                    clearable={false}
                    disabled={llmStore.loading}
                    onChange={(e) => {
                      llmStore.setLLMModel(
                        models.find((m) => m.name === e) ?? models[0]
                      );
                    }}
                    value={llmStore.LLMModel.name}
                    data={models.map((m) => ({
                      ...m,
                      value: m.name,
                      label: m.displayName,
                    }))}
                  />
                  <CopyButton value={llmStore.LLMResult} timeout={4000}>
                    {({ copied, copy }) => (
                      <Button
                        color={copied ? "gray" : "#FF9830"}
                        onClick={copy}
                      >
                        {copied ? "Copied result!" : "Copy result"}
                      </Button>
                    )}
                  </CopyButton>

                  <Button
                    color="#FF9830"
                    onClick={() => setShowPromptModal(true)}
                  >
                    Show Prompt
                  </Button>
                </Group>
              </Box>
              <Textarea
                placeholder="Query result"
                size="sm"
                autosize
                minRows={21}
                maxRows={21}
                value={LLMResult}
              />
            </Stack>
          </Group>

          <Modal
            size={"auto"}
            opened={showPromptModal}
            onClose={() => setShowPromptModal(false)}
            title={
              <Group justify="space-between">
                <Text>Prompt</Text>
                <CopyButton
                  value={llmStore.LLMTemplate.fn(llmStore.geneQuery)}
                  timeout={4000}
                >
                  {({ copied, copy }) => (
                    <Button color={copied ? "gray" : "orange"} onClick={copy}>
                      {copied ? "Copied prompt!" : "Copy prompt"}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            }
            style={{ overflow: "hidden" }}
          >
            <Divider />
            <Text
              style={{
                whiteSpace: "pre",
                wordBreak: "break-word",
                overflow: "scoll",
              }}
            >
              {llmStore.LLMTemplate.fn(llmStore.geneQuery)}
            </Text>
            <Space h="sm"></Space>
          </Modal>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
