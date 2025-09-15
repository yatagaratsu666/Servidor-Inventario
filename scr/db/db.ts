import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI!;
const dbName = process.env.MONGO_DB!;

let client: MongoClient;
let db: Db;

export const connectDB = async (): Promise<Db> => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Conectado a MongoDB");
    db = client.db(dbName);
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("❌ Conexión a MongoDB cerrada");
  }
};
