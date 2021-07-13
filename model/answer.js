const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Exam = require("./exam");

const answerSchema = new mongoose.Schema(
  {
    examid: {
      type: ObjectId,
      ref: "Exam",
      required: "true",
    },
    candidateid: {
      type: ObjectId,
      ref: "User",
      required: "true",
    },
    exited: {
      type: String,
      default: "",
    },
    answers: [
      {
        questionid: { type: ObjectId, ref: "Exam" },
        optionid: { type: ObjectId, ref: "Exam" },
        mark: Number,
      },
    ],
    totalmark: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Answer", answerSchema);
