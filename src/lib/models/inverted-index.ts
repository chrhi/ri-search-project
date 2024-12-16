import { Schema, model, models } from "mongoose";

interface TermDocument {
  docId: string;
  positions: number[];
}

interface InvertedIndexSchema {
  term: string;
  documents: TermDocument[];
}

const TermDocumentSchema = new Schema<TermDocument>({
  docId: { type: String, required: true },
  positions: { type: [Number], required: true },
});

const InvertedIndexSchema = new Schema<InvertedIndexSchema>({
  term: { type: String, required: true, unique: true },
  documents: { type: [TermDocumentSchema], required: true },
});

export default models.FichieInverse ||
  model("FichieInverse", InvertedIndexSchema);
