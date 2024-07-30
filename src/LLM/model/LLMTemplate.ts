import validGenes from "../../genes.json";

export const context =
  "You are an efficient and insightful assistant to a molecular biologist.";

const rawText = `
Write a critical analysis of the biological processes performed by this system of interacting proteins.

Base your analysis on prior knowledge available in your training data.  After completing your analysis, propose a brief and 
detailed name for the most prominent biological process performed by the system.
    
After completing your analysis, please also assign a confidence score to the process name you selected.  This score should 
follow the name in parentheses and range from 0.00 to 1.00. A score of 0.00 indicates the lowest confidence, while 1.00 reflects 
the highest confidence. This score helps gauge how accurately the chosen name represents the functions andactivities within 
the system of interacting proteins. When determining your score, consider the proportion of genes in the protein system that 
participate in the identified biological process. For instance, if you select "Ribosome biogenesis" as the process name but 
only a few genes in the system contribute to this process, the score should be lower compared to a scenario where a majority 
of the genes are involved in "Ribosome biogenesis".
     
Put your chosen name at the top of the analysis as 'Name: <name>'. 
Put your confidence in a new line after the name as ‘LLM self-assessed confidence: <confidence score>’
    
Be concise, do not use unnecessary words.
Be factual, do not editorialize.
Be specific, avoid overly general statements such as 'the proteins are involved in various cellular processes'.
Avoid listing facts about individual proteins. Instead, try to group proteins with similar functions and discuss their interplay, 
synergistic or antagonistic effects and functional integration within the system. Also avoid choosing generic process names such 
as 'Cellular Signaling and Regulation'.  If you cannot identify a prominent biological process for the proteins in the system, I 
want you to communicate this in you analysis and name the process: "System of unrelated proteins". Provide a score of 0.00 for 
a "System of unrelated proteins".
    
To help you in your work, I am providing an example system of interacting proteins and the corresponding example analysis output.

The example system of interacting proteins is:
PDX1, SLC2A2, NKX6-1, GLP1, GCG.

The example analysis output is:
Name: Pancreatic development and glucose homeostasis 
LLM self-assessed confidence: 0.96

1. PDX1 is a homeodomain transcription factor involved in the specification of the early pancreatic epithelium and 
its subsequent differentiation. It activates the transcription of several genes including insulin, somatostatin, glucokinase 
and glucose transporter type 2. It is essential for maintenance of the normal hormone-producing phenotype in the 
pancreatic beta-cell. In pancreatic acinar cells, forms a complex with PBX1b and MEIS2b and mediates the activation 
of the ELA1 enhancer.

2. NKX6-1 is also a transcription factor involved in the development of pancreatic beta-cells during the secondary transition. 
Together with NKX2-2 and IRX3, controls the generation of motor neurons in the neural tube and belongs to the neural progenitor 
factors induced by Sonic Hedgehog (SHH) signals.

3.GCG and GLP1, respectively glucagon and glucagon-like peptide 1, are involved in glucose metabolism and homeostasis. 
GCG raises blood glucose levels by promoting gluconeogenesis and is the counter regulatory hormone of Insulin. 
GLP1 is a potent stimulator of Glucose-Induced Insulin Secretion (GSIS). Plays roles in gastric motility and 
suppresses blood glucagon levels. Promotes growth of the intestinal epithelium and pancreatic islet mass both by islet 
neogenesis and islet cell proliferation.

4. SLC2A2, also known as GLUT2, is a facilitative hexose transporter. In hepatocytes, it mediates bi-directional 
transport of glucose accross the plasma membranes, while in the pancreatic beta-cell, it is the main transporter responsible 
for glucose uptake and part of the cell's glucose-sensing mechanism. It is involved in glucose transport in the small intestine 
and kidney too.

To summarize, the genes in this set are involved in the specification, differentiation, growth and functionality of the pancreas, 
with a particular emphasis on the pancreatic beta-cell. Particularly, the architecture of the pancreatic islet ensures proper 
glucose sensing and homeostasis via a number of different hormones and receptors that can elicit both synergistic and antagonistic 
effects in the pancreas itself and other peripheral tissues.
    

Here are the interacting proteins:

Proteins:
`;

export const defaultTemplate = {
  rawText,
  templateFn: (geneList: string): string => {
    const tokens = geneList.split(/[,\s;|:\\/,|\t]+/);

    // Filter the tokens, keeping only valid genes
    const validTokens = tokens
      .map((token) => token.replace(/[^a-zA-Z0-9]/g, ""))
      .filter((token) => {
        return validGenes.includes(token.toUpperCase());
      });

    return `${rawText}${validTokens.join(" ")}`;
  },
};

export type LLMTemplateFunction = (input: string) => string;

export interface LLMTemplate {
  name: string;
  description: string;
  rawText: string;
  fn: LLMTemplateFunction;
}

export const templates: LLMTemplate[] = [
  {
    name: "Default one-shot",
    description: "Default one-shot template for gene set analysis",
    fn: defaultTemplate.templateFn,
    rawText: defaultTemplate.rawText,
  },
];
