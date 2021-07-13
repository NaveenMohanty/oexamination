const Exam = require("../model/exam");
const User = require("../model/user");
const Answer = require("../model/answer");
const mongoose = require("mongoose");
const examHelper = require("../helpers/examHelper");

exports.getExamById = (req, res, next, id) => {
  Exam.findById(String(id), (err, exam) => {
    if (err || !exam) {
      return res.status(404).send({
        success: false,
        error: "Exam not found!!!",
      });
    }
    req.exam = exam;
    next();
  });
};

exports.getExam = (req, res) => {
  const { exam, profile } = req;
  if (String(req.profile._id) == String(req.exam.host)) {
    return res.json({ success: true, data: req.exam });
  } else if (
    req.exam.candidates.find(
      (candidate) => String(candidate.id) === String(req.profile._id)
    )
  ) {
    let start = Date.parse(exam.startingtime);
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());
    if (start > now) {
      exam.questions = undefined;
    } else if (now > start && now < end) {
      exam.questions = exam.questions.map((ques) => {
        ques.options = ques.options.map((option) => {
          option.isanswer = undefined;
          return option;
        });
        return ques;
      });
    }

    res.json({ success: true, data: exam });
  } else {
    return res.status(401).json({
      success: false,
      error: "You are not Athorized to Acces this exam.",
    });
  }
};

exports.createExam = async (req, res) => {
  try {
    const { body, profile } = req;
    body.host = profile._id;
    let start = Date.parse(body.startingtime);
    let now = Date.parse(Date());
    if (body.examtitle && body.startingtime && body.endingtime && start > now) {
      let exam = await Exam.create(body);
      profile.examhosted.push({ examid: exam._id });
      await profile.save();
      res.json({
        success: true,
        message: "Exam Created Successfully",
        data: exam,
      });
    } else {
      throw "Cannot create exam";
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.editExam = async (req, res) => {
  try {
    const { body, profile, exam } = req;
    let start = Date.parse(exam.startingtime);
    let now = Date.parse(Date());
    if (String(exam.host) === String(profile._id) && now < start) {
      let data = Object.keys(body);
      let promises = data.map((v) => {
        return new Promise(async (resolve, reject) => {
          if (v === "candidates") {
            let bodyCand = body[v].map((v) => String(v.id));
            let examCand = exam[v].map((v) => String(v.id));
            let add = bodyCand.filter((x) => !examCand.includes(x));
            let dele = examCand.filter((x) => !bodyCand.includes(x));

            let sucess = await examHelper.addExamIntoCandidates(add, exam._id);

            if (!Boolean(sucess)) {
              return reject("Unable to save");
            }
            sucess = await examHelper.deleExamIntoCandidates(dele, exam._id);

            if (!Boolean(sucess)) {
              return reject("Unable to save");
            }
          }
          exam[v] = body[v];
          resolve();
        });
      });
      await Promise.all(promises);
      await exam.save();
      res.json({ success: true, message: "Exam updated successfully" });
    } else {
      throw "Unable to update question";
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { exam, profile } = req;
    let start = Date.parse(exam.startingtime);
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());
    if (
      String(exam.host) === String(profile._id) &&
      (now < start || now > end)
    ) {
      profile.examhosted = profile.examhosted.filter(
        (v) => String(v.examid) !== String(exam._id)
      );
      let examCand = exam.candidates.map((v) => String(v.id));
      let success = await examHelper.deleExamIntoCandidates(examCand, exam._id);
      if (!Boolean(success)) {
        throw "Unable to save";
      }
      await profile.save();
      let answers = await Answer.find({ examid: exam._id });
      await examHelper.deleAnsIntoCandidates(answers);
      await Answer.deleteMany({ examid: exam._id });
      await Exam.findByIdAndRemove(exam._id);
      res.json({
        success: true,
        message: "Exam deleted",
      });
    } else {
      throw "Unable to delete";
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.getUserUpcomingHostedExam = (req, res) => {
  let examids = req.profile.examhosted;
  let exams = examids.map((element) => {
    return new Promise((resolve, reject) => {
      Exam.findById(element.examid, (err, exam) => {
        if (err) {
          return resolve({ status: false });
        }
        let end = Date.parse(exam.endingtime);
        let now = Date.parse(Date());
        if (end >= now) {
          exam.questions = undefined;
          exam.candidates = undefined;
          return resolve({ status: true, exam });
        } else {
          return resolve({ status: false });
        }
      }).populate("host", "_id name");
    });
  });
  Promise.all(exams).then((result) => {
    let arr = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (element.status) {
        arr.push(element.exam);
      }
    }
    res.json({ success: true, data: arr });
  });
};

exports.getUserPastHostedExam = (req, res) => {
  let examids = req.profile.examhosted;
  let exams = examids.map((element) => {
    return new Promise((resolve, reject) => {
      Exam.findById(element.examid, (err, exam) => {
        if (err) {
          return resolve({ status: false });
        }
        let start = Date.parse(exam.endingtime);
        let now = Date.parse(Date());
        if (start < now) {
          exam.questions = undefined;
          exam.candidates = undefined;
          return resolve({ status: true, exam });
        } else {
          return resolve({ status: false });
        }
      }).populate("host", "_id name");
    });
  });
  Promise.all(exams).then((result) => {
    let arr = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if (element.status) {
        arr.push(element.exam);
      }
    }
    res.json({ success: true, data: arr });
  });
};
