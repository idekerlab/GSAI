import { LLMModel } from "../model/LLMModel";
import { Stream } from "openai/streaming.mjs";

export const analyzeSubsystemGeneSet = async (
  message: string,
  model: LLMModel
): Promise<Stream<any>> => {
  const { runQuery } = model;

  // if(mock) {
  //     return Promise.resolve(testGPTResponse.choices[0].message.content)
  // }
  return runQuery(message);
};
