import { NextResponse } from "next/server";
import Feedback from "../../../../models/Feedback";
import connectMongoDB from "../../../../utils/mongoDB";

export async function POST(req) {
  try {
    const body = await req.json();
    await connectMongoDB();
    await Feedback.create(body);

    return NextResponse.json(
      { message: "Feedback added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to add feedback" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const feedbacks = await Feedback.find();

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch feedbacks" },
      { status: 400 }
    );
  }
}
