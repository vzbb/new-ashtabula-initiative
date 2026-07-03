const { QdrantClient } = require('@qdrant/js-client-rest');

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://192.168.1.223:6333'
});

const COLLECTION_NAME = 'zoning_ashtabula';

async function setup() {
  try {
    // Check if collection exists
    const collections = await client.getCollections();
    const exists = collections.collections.find(c => c.name === COLLECTION_NAME);
    
    if (exists) {
      console.log(`Collection ${COLLECTION_NAME} already exists`);
      return;
    }

    // Create collection with 1536 dimensions (OpenAI embeddings)
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 1536,
        distance: 'Cosine'
      },
      optimizers_config: {
        default_segment_number: 2
      }
    });

    // Create payload indexes for filtering
    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'document_type',
      field_schema: 'keyword'
    });

    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'source',
      field_schema: 'keyword'
    });

    console.log(`✓ Collection ${COLLECTION_NAME} created successfully`);
  } catch (error) {
    console.error('Error setting up Qdrant:', error.message);
    process.exit(1);
  }
}

setup();
