import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please add MONGODB_URI to .env.local");
  return uri;
}

declare global {
  // Prevent multiple instances in dev (hot reload)
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

// ── MongoDB native client (required by MongoDBAdapter) ──────────────────────
// Wrapped in a factory so the URI is resolved lazily at runtime, not at build time.

function getClientPromise(): Promise<MongoClient> {
  const uri = getUri();
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
  const client = new MongoClient(uri);
  return client.connect();
}

// MongoDBAdapter accepts a promise or a factory — pass the factory so connection
// is deferred until the first auth request, not module load time.
export default getClientPromise;

// ── Mongoose connection (for models) ────────────────────────────────────────

export async function connectMongoose(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState >= 1) return mongoose;

  const uri = getUri();

  if (process.env.NODE_ENV === "development") {
    if (!global._mongooseConnection) {
      global._mongooseConnection = mongoose.connect(uri);
    }
    return global._mongooseConnection;
  }

  return mongoose.connect(uri);
}
