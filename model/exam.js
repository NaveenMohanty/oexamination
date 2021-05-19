const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ExamSchema = new mongoose.Schema(
  {
    examtitle: {
      type: String,
      required: true,
      trim: true,
    },
    examinfo: {
      type: String,
      trim: true,
    },
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
    startingtime: {
      type: String,
      required: true,
      trim: true,
    },
    endingtime: {
      type: String,
      required: true,
      trim: true,
    },
    candidates: [{ id: { type: ObjectId, ref: "User" } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
