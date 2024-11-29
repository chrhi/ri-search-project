import fs from "fs";
import path from "path";
import { PorterStemmer } from "natural";
import { stoplist } from "@/config/stop-list";

interface TextFileData {
  docNumber: string;
  content: string[];
}

interface InvertedIndex {
  [term: string]: {
    docId: string;
    positions: number[];
  }[];
}

function normalizeTerms(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  return words
    .filter((word) => !stoplist.includes(word))
    .map((word) => PorterStemmer.stem(word));
}

export async function getTextFileData(
  folderPath: string
): Promise<TextFileData[]> {
  const files = await fs.promises.readdir(folderPath);
  const textFileData: TextFileData[] = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContent = await fs.promises.readFile(filePath, "utf8");
    const docNumber = file.slice(0, -4); // Remove the .txt extension
    const terms = normalizeTerms(fileContent);

    textFileData.push({
      docNumber,
      content: terms,
    });
  }

  return textFileData;
}

export function createInvertedIndex(
  textFileData: TextFileData[]
): InvertedIndex {
  const invertedIndex: InvertedIndex = {};

  for (const { docNumber, content } of textFileData) {
    for (const [index, term] of content.entries()) {
      if (!invertedIndex[term]) {
        invertedIndex[term] = [];
      }
      invertedIndex[term].push({
        docId: docNumber,
        positions: [index],
      });
    }
  }

  return invertedIndex;
}
