import { NextResponse } from "next/server";
import { getTextFileData, createInvertedIndex } from "@/lib/text-processing";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  const COLLECTION_TIME_FOLDER_PATH = path.join(
    process.cwd(),
    "public",
    "Collection_TIME"
  );

  try {
    console.log("Creating the document");
    const textFileData = await getTextFileData(COLLECTION_TIME_FOLDER_PATH);
    const invertedIndex = createInvertedIndex(textFileData);

    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), "public");
    await fs.mkdir(publicDir, { recursive: true });

    // Write the inverted index to a JSON file in the public directory
    const indexFilePath = path.join(publicDir, "inverted-index.json");
    await fs.writeFile(indexFilePath, JSON.stringify(invertedIndex, null, 2));

    console.log(`Inverted index stored at ${indexFilePath}`);

    return NextResponse.json({
      textFileData,
      invertedIndex,
      indexStoredAt: "/inverted-index.json",
    });
  } catch (error) {
    console.error("Error fetching text file data:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to process text files or store inverted index",
      },
      { status: 500 }
    );
  }
}
