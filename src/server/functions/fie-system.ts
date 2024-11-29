import fs from "fs";
import path from "path";

interface TextFileData {
  docNumber: string;
  content: string;
}

async function getTextFileData(folderPath: string): Promise<TextFileData[]> {
  const files = await fs.promises.readdir(folderPath);
  const textFileData: TextFileData[] = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContent = await fs.promises.readFile(filePath, "utf8");
    const docNumber = file.slice(0, -4); // Remove the .txt extension

    textFileData.push({
      docNumber,
      content: fileContent,
    });
  }

  return textFileData;
}

// Usage example
const COLLECTION_TIME_FOLDER_PATH = path.join(
  process.cwd(),
  "public",
  "Collection_TIME"
);

async function fetchTextFileData() {
  try {
    const textFileData = await getTextFileData(COLLECTION_TIME_FOLDER_PATH);
    console.log(textFileData);
  } catch (error) {
    console.error("Error fetching text file data:", error);
  }
}

fetchTextFileData();
