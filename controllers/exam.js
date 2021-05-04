const Exam = require("../model/exam");

exports.getExamById = (req, res, next, id) => {
  Exam.findById(id, (exam, err) => {
    if (err || !exam) {
      res.status(404).send({
        error: "Exam not found",
      });
    }
    req.exam = exam;
  });
  next();
};
exports.getExam = (req, res) => {
  res.json(req.exam);
};
exports.createExam = (req, res) => {
  Exam.create(req.body, function (err, exam) {
    if (err) {
      res.status(400).json({
        error: "Exam not found",
      });
    }
    res.json({
      examid: exam._id,
    });
  });
};

exports.addQuestion = (req, res) => {
  Exam.findById(req.exam._id, function (err, exam) {
    if (err) {
      res.status(404).json({
        error: "Exam not found",
      });
    }
    let questions = exam.questions;
    questions.push(req.body.question);
    exam.questions = questions;
    exam.save((err, exam) => {
      if (err) {
        return res.status(404).json({
          error: "Unable to update question",
        });
      }
      res.json(exam);
    });
  });
};

exports.deleteQuestion = (req, res) => {
  Exam.findById(req.exam._id, function (err, exam) {
    if (err) {
      return res.status(404).json({
        error: "Exam not found",
      });
    }
    let questions = exam.questions.filter(
      (ques) => ques._id !== req.body.questionid
    );
    exam.questions = questions;
    exam.save((err, exam) => {
      if (err) {
        return res.status(404).json({
          error: "Unable to update question",
        });
      }
      res.json(exam);
    });
  });
};
