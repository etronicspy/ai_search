import { config } from "dotenv";
import { initializeCollection } from "./db/qdrant-client";

config({ path: "/Users/etronicspy/takeoff-rag-course/sections/1-learn-the-basics/.env.local" });

console.log("QDRANT_URL:", process.env.QDRANT_URL);
console.log("QDRANT_API_KEY:", process.env.QDRANT_API_KEY ? "***" : "undefined");

// Initialize Qdrant collection
initializeCollection()
  .then(() => console.log("Qdrant collection initialized successfully"))
  .catch((error) => {
    console.error("Failed to initialize Qdrant collection:", error);
    process.exit(1);
  }); 