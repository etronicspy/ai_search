import { config } from "dotenv";
import OpenAI from "openai";

config({ path: "/Users/etronicspy/takeoff-rag-course/sections/1-learn-the-basics/.env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbeddings(texts: string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 1536,
    input: texts
  });

  return response.data.map((item) => item.embedding);
}

// Test the function if run directly
if (import.meta.url === import.meta.resolve("./2-generate-embeddings.ts")) {
  generateEmbeddings(["Hello, world!", "Goodbye, world!", "My name is Mckay"])
    .then((embeddings) => {
      console.log(`Generated ${embeddings.length} embeddings`);
      console.log(`Each embedding has ${embeddings[0].length} dimensions`);
    })
    .catch(console.error);
}
