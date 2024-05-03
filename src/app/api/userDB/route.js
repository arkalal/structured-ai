import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { dbUri } = await req.json();

    console.log("DBUri", dbUri);

    const client = new MongoClient(dbUri);

    await client.connect();
    console.log("req", req);

    return NextResponse.json(
      { message: "Connected to MongoDB" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error Connecting" }, { status: 400 });
  }
}
