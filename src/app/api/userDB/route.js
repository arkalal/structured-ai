import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Feedback from "../../../../models/Feedback";
import connectMongoDB from "../../../../utils/mongoDB";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const functions = [
  {
    name: "analyze_feedback",
    description:
      "Analyze customer feedback for sentiment, complaints, and potential product switch intentions.",
    parameters: {
      type: "object",
      properties: {
        feedback: {
          type: "string",
          description: "Customer feedback text to be analyzed.",
        },
        sentiment: {
          type: "string",
          description: "Sentiment of the feedback",
          enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"],
        },
        complaints: {
          type: "array",
          description: "List of complaints identified from the feedback",
          items: {
            type: "string",
            enum: [
              "COMPLICATED",
              "DIFFICULT_SETUP",
              "EXPENSIVE",
              "INTEGRATION_ISSUES",
              "POOR_CUSTOMER_SERVICE",
              "USER_INTERFACE",
              "BUGS",
            ],
          },
        },
        switchedTo: {
          type: "string",
          description:
            "Product the customer is considering switching to, if any.",
        },
      },
      required: ["feedback", "sentiment", "complaints", "switchedTo"], // Specify which properties are required for the function to execute
    },
  },
];

export async function POST(req) {
  let client;
  try {
    const { dbUri } = await req.json();

    console.log("DBUri", dbUri);

    client = new MongoClient(dbUri);

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
            content: `You are a helpful assistant to analyze a unstructured data into structured with proper categories based on the functions. Analyze the feedback data: ${feedback.feedback}`,
          },
        ],
        model: "gpt-4-1106-preview",
        temperature: 0.9,
        max_tokens: 200,
        functions: functions,
      });

      console.log("response", response.choices[0].message.function_call);

      if (response.choices[0] && response.choices[0].message.function_call) {
        const args = JSON.parse(
          response.choices[0].message.function_call.arguments
        );

        await connectMongoDB();
        const newFeedback = new Feedback({
          name: feedback.name,
          feedback: feedback.feedback,
          sentiment: args.sentiment || "NEUTRAL",
          complaints: args.complaints || [],
          switchedTo: args.switchedTo || null,
        });

        await newFeedback.save();
      }
    }
    return NextResponse.json(
      { message: "Connected to MongoDB and data processed" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error Connecting" }, { status: 400 });
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
