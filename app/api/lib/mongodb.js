import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL= "mongodb://CrocsEnFourrure69:J3M4NG3D3SL3GUM3S!@163.5.59.146:27017/tp2?authSource=tp2&directConnection=true"
);  // Utilisez votre URI MongoDB

export async function connectToDatabase() {
    if (!client.isConnected()) {
        await client.connect();
    }
    const db = client.db("tp2");
    return { db, client };
}
