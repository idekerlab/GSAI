import OpenAI from "openai";
import { context } from "./LLMTemplate";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface LLMModel {
  name: string;
  displayName: string;
  key: string;
  runQuery: (query: string) => any;
}

export const models: LLMModel[] = [
  {
    displayName: "GPT-4 2023-11-06 Preview",
    name: "gpt-4-1106-preview",
    key: "",
    runQuery: async function (query: string) {
      try {
        const openai = new OpenAI({
          apiKey: "",
          dangerouslyAllowBrowser: true,
        });
        const stream = await openai.chat.completions.create({
          model: "gpt-4-1106-preview",
          seed: 42,
          temperature: 0,
          n: 1,
          max_tokens: 1000,
          stop: null,
          messages: [
            { role: "system", content: context },
            { role: "user", content: query },
          ],
          stream: true,
        });

        return stream;
      } catch (e) {
        console.log("LLM", e);
        throw e;
      }
    },
  },
  {
    displayName: "Gemini-Pro",
    name: "gemini",
    key: "",
    runQuery: async function (query: string) {
      const key = "";
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContentStream(`${context} ${query}`);
      return result.stream;
    },
  },
  {
    displayName: "GPT-3.5 Turbo 2023-11-06",
    name: "gpt-3.5-turbo-1106",
    key: "",
    runQuery: async function (query: string) {
      const openai = new OpenAI({
        apiKey: "",
        dangerouslyAllowBrowser: true,
      });
      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          seed: 42,
          temperature: 0,
          n: 1,
          max_tokens: 1000,
          stop: null,
          messages: [
            { role: "system", content: context },
            { role: "user", content: query },
          ],
          stream: true,
        });

        return stream;
      } catch (e) {
        console.log("LLM", e);
        throw e;
      }
    },
  },
  {
    displayName: "Mixtral Instruct (Slow)",
    name: "mixtral:instruct",
    key: "",
    runQuery: async function (query: string) {
      const abortController = new AbortController();

      const stream = await fetch("", {
        method: "POST",
        signal: abortController.signal,
        body: JSON.stringify({
          model: "mixtral:instruct",
          stream: true,
          messages: [
            { role: "system", content: context },
            { role: "user", content: query },
          ],
          options: {
            seed: 42,
            num_predict: 1000,
            temperature: 0,
          },
        }),
      });
      return { stream, abortController };
    },
  },
  {
    displayName: "Llama 2 70b (Slow)",
    name: "llama2:70b",
    key: "",
    runQuery: async function (query: string) {
      const abortController = new AbortController();
      const stream = await fetch("", {
        signal: abortController.signal,
        method: "POST",
        body: JSON.stringify({
          model: "llama2:70b",
          stream: true,
          messages: [
            { role: "system", content: context },
            { role: "user", content: query },
          ],
          options: {
            seed: 42,
            num_predict: 1000,
            temperature: 0,
          },
        }),
      });
      return { stream, abortController };
    },
  },

  // },
  //     {
  //         displayName: 'Llama2',
  //         name: 'Llama2 70b',
  //         key: '',
  //         runQuery: () => Promise.resolve('')
  //     }
  // ]
];
