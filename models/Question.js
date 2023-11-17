import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  subject: String,
  topic: String,
  difficulty: String,
  marks: Number,
});

const QuestionModel = mongoose.model("Question", questionSchema);

export default QuestionModel;
