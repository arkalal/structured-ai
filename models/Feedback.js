import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema({
  name: { type: String },
  feedback: { type: String, required: true },
  sentiment: { type: String },
  complaints: [{ type: String }],
  switchedTo: { type: String },
});

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;
