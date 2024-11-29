import { NextResponse } from "next/server";
import { getTextFileData, createInvertedIndex } from "@/lib/text-processing";
import path from "path";
import { saveInvertedIndex } from "@/lib/db-functions";

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

    await saveInvertedIndex(invertedIndex);

    return NextResponse.json({
      invertedIndex,
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
