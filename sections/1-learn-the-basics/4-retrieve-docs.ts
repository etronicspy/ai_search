import { generateEmbeddings } from "./2-generate-embeddings";
import { COLLECTION_NAME, qdrantClient } from "./db/qdrant-client";

export async function retrieveDocuments(query: string, limit = 3) {
  const embeddings = await generateEmbeddings([query]);

  const results = await qdrantClient.search(COLLECTION_NAME, {
    vector: embeddings[0],
    limit: limit,
    with_payload: true
  });

  return results
    .filter(hit => hit.payload && typeof hit.payload.name === 'string' && typeof hit.payload.content === 'string')
    .map(hit => ({
      name: hit.payload!.name as string,
      content: hit.payload!.content as string,
      score: hit.score
    }));
}
