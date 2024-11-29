import InvertedIndexModel from "./models/inverted-index";
import { connectToDB } from "./database";

export const saveInvertedIndex = async (invertedIndex: {
  [term: string]: { docId: string; positions: number[] }[];
}) => {
  try {
    await connectToDB();

    for (const term in invertedIndex) {
      const documents = invertedIndex[term];

      await InvertedIndexModel.updateOne(
        { term },
        { $set: { documents } },
        { upsert: true }
      );
    }

    console.log("Inverted index saved successfully");
  } catch (error) {
    console.error("Error saving inverted index:", error);
    throw error;
  }
};

export const getInvertedIndex = async (term?: string) => {
  try {
    await connectToDB();

    if (term) {
      const result = await InvertedIndexModel.findOne({ term });
      return result ? result.toObject() : null;
    }

    const allResults = await InvertedIndexModel.find();
    return allResults.map((doc) => doc.toObject());
  } catch (error) {
    console.error("Error retrieving inverted index:", error);
    throw error;
  }
};
