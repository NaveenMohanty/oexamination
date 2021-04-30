const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ExamSchema = new mongoose.Schema(
  {
    examtitle: String,
    host: {
      type: ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    questions: [
      {
        title: String,
        options: [{ option: String, isanswer: Boolean }],
        mark: Number,
      },
    ],
    startingtime: String,
    endingtime: String,
    candidates: [{ id: { type: ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
