import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Feedback from "../../../../models/Feedback";
import connectMongoDB from "../../../../utils/mongoDB";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractSentiment(text) {
  // Example: find sentiment from the analyzed text
  const sentimentMatch = text.match(/sentiment:\s*(\w+)/i);
  return sentimentMatch ? sentimentMatch[1] : "NEUTRAL";
}

function extractComplaints(text) {
  // Example: find a list of complaints from the analyzed text
  const complaintsMatch = text.match(/complaints:\s*([\w\s,]+)/i);
  return complaintsMatch
    ? complaintsMatch[1].split(",").map((s) => s.trim())
    : [];
}

function extractSwitchedTo(text) {
  // Example: find any switch intentions from the analyzed text
  const switchedToMatch = text.match(/switched to:\s*(\w+)/i);
  return switchedToMatch ? switchedToMatch[1] : null;
}

export async function POST(req) {
  try {
    const { dbUri } = await req.json();

    console.log("DBUri", dbUri);

    const client = new MongoClient(dbUri);

    await client.connect();
    console.log("req", req);

    const db = client.db();
    const collection = db.collection("instructs");
    const userFeedbacks = await collection.find({}).toArray();

    for (const feedback of userFeedbacks) {
      const response = await openAi.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant to analyze a unstructured data into structured with proper categories. Analyze the feedback data: ${feedback.feedback}`,
          },
        ],
        model: "gpt-4-1106-preview",
        temperature: 0.9,
        max_tokens: 200,
      });

      await connectMongoDB();
      const newFeedback = new Feedback({
        feedback: feedback.feedback,
        sentiment: extractSentiment(response.choices[0].message.content),
        complaints: extractComplaints(response.choices[0].message.content),
        switchedTo: extractSwitchedTo(response.choices[0].message.content),
      });

      await newFeedback.save();
    }

    return NextResponse.json(
      { message: "Connected to MongoDB and data processed" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error Connecting" }, { status: 400 });
  }
}
