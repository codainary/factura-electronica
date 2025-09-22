CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE "InvoiceEmbedding" ADD COLUMN embedding vector(384);
