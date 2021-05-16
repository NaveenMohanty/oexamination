const Exam = require("../model/exam");
const User = require("../model/user");
const mongoose = require("mongoose");

exports.getExamById = (req, res, next, id) => {
  Exam.findById(id, (err, exam) => {
    if (err || !exam) {
      console.log(err);
      console.log(exam);
      return res.status(404).send({
        success: false,
        error: "Exam not found!!!",
      });
    }
    req.exam = exam;
  });
  next();
};

exports.getExam = (req, res) => {
  if (String(req.profile._id) == String(req.exam.host)) {
    res.json({ success: true, exam: req.exam });
  } else if (
    req.exam.candidates.find((id) => String(id) === String(req.profile._id))
  ) {
    exam.candidates = undefined;
    res.json({ success: true, exam: req.exam });
  } else {
    return res.status(401).json({
      success: false,
      error: "You are not Athorized to Acces this exam.",
    });
  }
};

exports.createExam = (req, res) => {
  const { body, profile } = req;
  body.host = profile._id;
  Exam.create(body, function (err, exam) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: "Exam not found",
      });
    }
    profile.examhosted.push(exam._id);
    profile.save((err, user) => {
      if (err) {
        Exam.findByIdAndRemove(exam._id, function (err, exam) {
          if (err) {
            return res.status(403).json({
              success: false,
              error: "Cannot create exam",
            });
          }
        });
        return res.status(403).json({
          success: false,
          error: "Cannot create exam",
        });
      }
    });
    res.json({ success: true, exam });
  });
};

exports.editExam = (req, res) => {
  // console.log(req.body, req.exam, req.profile);
  const { body, profile, exam } = req;
  let start = Date.parse(
    "Thu May 30 2021 12:00:00 GMT+0530 (India Standard Time)"
  );
  let now = Date.parse(Date());
  if (String(exam.host) === String(profile._id) && now < start) {
    let data = Object.keys(body);
    data.map((v) => {
      exam[v] = body[v];
    });
    exam.save((err, exam) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: "This exam is not hosted By you.",
        });
      }
      res.json({ success: true, exam });
    });
  } else {
    return res.status(404).json({
      success: false,
      error: "Unable to update question",
    });
  }
};

exports.deleteExam = (req, res) => {
  const { exam, profile } = req;
  if (String(exam.host) === String(profile._id)) {
    Exam.findByIdAndRemove(exam._id, function (err, exam) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: "Unable to delete!",
        });
      }
      profile.examhosted = profile.examhosted.filter(
        (v) => String(v._id) !== String(exam._id)
      );
      profile.save((err, user) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: "Unable to delete",
          });
        }
      });
    });
    res.json({
      success: true,
      message: "Exam deleted",
    });
  } else {
    return res.status(400).json({
      success: false,
      error: "Unable to delete",
    });
  }
};
