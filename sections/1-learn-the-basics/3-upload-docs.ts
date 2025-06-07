import { config } from "dotenv";
import OpenAI from "openai";
import { COLLECTION_NAME, qdrantClient } from "./db/qdrant-client";

config({ path: "/Users/etronicspy/takeoff-rag-course/sections/1-learn-the-basics/.env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MOCK_DOCS = [
  {
    content: "The African Elephant, Earth's largest land mammal, possesses remarkable intelligence and complex social structures. These gentle giants communicate through infrasound frequencies that can travel for miles, helping maintain family bonds. Their trunks contain over 40,000 muscles and can be used for breathing, drinking, and handling objects.",
    name: "African Elephant Facts"
  },
  {
    content: "The Giant Sequoia trees of California are among the longest-living organisms on Earth, with lifespans exceeding 3,000 years. These magnificent trees can grow to heights of 300 feet and have bark that can be two feet thick, naturally fire-resistant, and rich in tannins that protect against fungal infections.",
    name: "Giant Sequoia Facts"
  },
  {
    content: "Octopuses are considered the most intelligent invertebrates, with problem-solving abilities and short/long-term memory. They have three hearts, blue blood containing copper-based hemocyanin, and can change both color and texture of their skin within seconds for camouflage or communication.",
    name: "Octopus Intelligence"
  },
  {
    content: "The Venus Flytrap, a carnivorous plant, has evolved sophisticated trigger hairs that count electrical impulses to ensure their prey is real before snapping shut. The trap only closes when an insect touches two different trigger hairs within 20 seconds, preventing false alarms.",
    name: "Venus Flytrap Mechanics"
  },
  {
    content: "Arctic Foxes demonstrate remarkable adaptation to extreme cold, with fur that changes color seasonally and provides the best insulation of any mammal. Their compact body, furry soles, short ears, and ability to lower surface blood flow help them survive in temperatures as low as -50°C.",
    name: "Arctic Fox Adaptation"
  },
  {
    content: "The Titan Arum, nicknamed 'corpse flower', produces the world's largest unbranched inflorescence, reaching up to 10 feet tall. When blooming, it generates heat and emits a powerful odor resembling rotting flesh to attract pollinators. This rare event occurs every 7-10 years.",
    name: "Titan Arum Features"
  },
  {
    content: "Hummingbirds are the only birds that can fly backwards and hover in mid-air. Their hearts beat up to 1,260 times per minute during flight, and they visit up to 2,000 flowers daily. They can see ultraviolet light and have the highest metabolism of any warm-blooded animal.",
    name: "Hummingbird Capabilities"
  },
  {
    content: "The Bamboo plant demonstrates extraordinary growth capabilities, with some species growing up to 35 inches in a single day. This rapid growth is possible due to unique rhizome systems that store nutrients and specialized cell structures that allow for rapid cell elongation.",
    name: "Bamboo Growth"
  },
  {
    content: "Dolphins sleep with one brain hemisphere at a time, keeping one eye open to watch for predators and surface for breathing. They recognize themselves in mirrors, have unique whistle signatures for different individuals, and can remember other dolphins' calls for decades.",
    name: "Dolphin Intelligence"
  },
  {
    content: "The Baobab tree, known as the 'Tree of Life', can store up to 120,000 liters of water in its trunk during rainy seasons. These ancient giants can live for over 2,000 years, provide food, water, and shelter to countless species, and some specimens reach 25 meters in circumference.",
    name: "Baobab Tree Facts"
  }
];

export async function uploadDocuments(docs: { content: string; name: string }[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 1536,
    input: docs.map((doc) => doc.content)
  });

  console.log("Generated embeddings:", response.data.length);

  // Upload points to Qdrant
  await qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    points: response.data.map((item, index) => ({
      id: index + 1, // Use number as ID
      vector: item.embedding,
      payload: {
        content: docs[index].content,
        name: docs[index].name
      }
    }))
  });

  console.log("Uploaded points to Qdrant");
  return response.data.map((item) => item.embedding);
}

// Upload documents
uploadDocuments(MOCK_DOCS)
  .then(() => console.log("Documents uploaded successfully"))
  .catch((error) => {
    console.error("Failed to upload documents:", error);
    process.exit(1);
  });
