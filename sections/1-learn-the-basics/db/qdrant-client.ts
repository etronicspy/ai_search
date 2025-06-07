import { config } from "dotenv";
import { QdrantClient } from "@qdrant/js-client-rest";

// Load environment variables
config({ path: "/Users/etronicspy/takeoff-rag-course/sections/1-learn-the-basics/.env.local" });

if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
  throw new Error("QDRANT_URL and QDRANT_API_KEY must be set in environment variables");
}

// Initialize the Qdrant client
export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  timeout: 120000 // 2 minutes timeout
});

// Collection name for our documents
export const COLLECTION_NAME = "documents";

// Initialize collection if it doesn't exist
export async function initializeCollection() {
  try {
    // Check if collection exists
    const collections = await qdrantClient.getCollections();
    console.log("Available collections:", collections);
    
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      // Create new collection
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1536, // OpenAI embeddings dimension
          distance: "Cosine" // Distance metric
        }
      });
      console.log(`Collection ${COLLECTION_NAME} created successfully`);
    } else {
      console.log(`Collection ${COLLECTION_NAME} already exists`);
    }
  } catch (error) {
    console.error("Error initializing Qdrant collection:", error);
    throw error;
  }
} 