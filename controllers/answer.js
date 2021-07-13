const Answer = require("../model/answer");
const Exam = require("../model/exam");
const User = require("../model/user");

exports.getAnswerById = (req, res, next, id) => {
  Answer.findById(id, function (err, answer) {
    if (err || !answer) {
      return res.status(404).json({
        success: false,
        error: "No answer was found in DB",
      });
    }
    req.answer = answer;
    next();
  });
};

exports.createAnswer = async (req, res) => {
  try {
    const { profile, exam } = req;
    let start = Date.parse(exam.startingtime);
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());

    if (
      exam.candidates.find((v) => String(v.id) === String(profile._id)) &&
      now > start &&
      now < end
    ) {
      let answer = await Answer.findOne({
        examid: exam._id,
        candidateid: profile._id,
      });
      if (!answer) {
        answer = await Answer.create({
          examid: exam._id,
          candidateid: profile._id,
        });
        profile.examattained.push({
          examid: exam._id,
          answerid: answer._id,
        });
        await profile.save();
      } else {
        if (answer.exited) throw "You have Exited the exam.";
      }
      res.json({
        success: true,
        message: "Exam starts now.",
        data: { _id: answer._id, answers: answer.answers },
      });
    } else {
      throw "Can't enter exam section now.";
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.editAnswer = async (req, res) => {
  try {
    const { profile, exam, answer, body } = req;
    let start = Date.parse(exam.startingtime);
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());
    if (
      profile.examattained.find(
        (v) =>
          String(v.examid) === String(exam._id) &&
          String(v.answerid) === String(answer._id)
      ) &&
      now > start &&
      now < end &&
      !answer.exited
    ) {
      let { answers } = body;
      let { questions } = exam;
      let marks = 0;
      let answersPromise = answers.map((ans) => {
        return new Promise((resolve, reject) => {
          let question = questions.find(
            (ques) => String(ques._id) === String(ans.questionid)
          );
          if (question) {
            let option = question.options.find(
              (opti) => String(opti._id) === String(ans.optionid)
            );
            if (option.isanswer) {
              marks += question.mark;
              return resolve({ ...ans, mark: question.mark });
            } else {
              return resolve({ ...ans, mark: 0 });
            }
          } else {
            return reject("Question was not found");
          }
        });
      });
      answer.answers = await Promise.all(answersPromise);
      answer.totalmark = marks;
      await answer.save();
      res.json({ success: true });
    } else {
      if (req.answer.exited) throw "You have exited the exam";
      else throw "You cannot create Answer now";
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

// exports.getAnswerByhost = async (req, res) => {
//   try {
//     const { profile } = req;
//     const { exam_id, candidate_id } = req.query;
//     let exam = await Exam.findById(exam_id);
//     if (String(exam.host) === String(profile._id)) {
//       let answer = await Answer.find({
//         examid: exam_id,
//         candidateid: candidate_id,
//       });
//       res.json({ success: true, message: "Answer fetched", data: answer });
//     } else {
//       throw "You are not host of this exam";
//     }
//   } catch (error) {
//     res.json({
//       success: false,
//       error: error.message || error,
//     });
//   }
// };
// exports.getAnswerByCandidate = async (req, res) => {
//   try {
//     const { profile } = req;
//     const { answer_id } = req.query;
//     let answer = await Answer.findById(answer_id);
//     if (String(answer.candidateid) === String(profile._id)) {
//       res.json({ success: true, message: "Answer fetched", data: answer });
//     } else {
//       throw "You are not candidate of this exam";
//     }
//   } catch (error) {
//     res.json({
//       success: false,
//       error: error.message || error,
//     });
//   }
// };

exports.exitAnswer = async (req, res) => {
  try {
    const { profile, exam, answer, body } = req;
    let start = Date.parse(exam.startingtime);
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());
    if (
      profile.examattained.find(
        (v) =>
          String(v.examid) === String(exam._id) &&
          String(v.answerid) === String(answer._id)
      ) &&
      now > start &&
      now < end &&
      (String(answer.candidateid) === String(profile._id) ||
        String(exam.host) === String(profile._id))
    ) {
      answer.exited = body.exited;
      await answer.save();
      res.json({
        success: true,
      });
    } else {
      throw "You cannot create Answer now";
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

// exports.getAnswerList = async (req, res) => {
//   try {
//     const { profile, exam, answer } = req;
//     let start = Date.parse(exam.startingtime);
//     let end = Date.parse(exam.endingtime);
//     let now = Date.parse(Date());
//     if (
//       profile.examattained.find(
//         (v) =>
//           String(v.examid) === String(exam._id) &&
//           String(v.answerid) === String(answer._id)
//       ) &&
//       now > start &&
//       now < end &&
//       (String(answer.candidateid) === String(profile._id) ||
//         String(exam.host) === String(profile._id))
//     ) {
//       answer.exited = body.exited;
//       await answer.save();
//       res.json({
//         success: true,
//       });
//     } else {
//       throw "You cannot create Answer now";
//     }
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message || error,
//     });
//   }
// };

// find all answers of a exam after the ending time and user must be host of the exam and also populate the candidate _id,name and email
exports.getAllAnswerOfExam = async (req, res) => {
  try {
    const { profile, exam } = req;
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());
    if (now > end && String(exam.host) === String(profile._id)) {
      let answer = await Answer.find({
        examid: exam._id,
      }).populate("candidateid", "_id name");
      res.json({ success: true, message: "Answers fetched", data: answer });
    } else {
      if (now < end) throw "Can't get result now";
      else throw "You are not host of this exam";
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message || error,
    });
  }
};

// find answer of a candidate for given exam
exports.getAnswerOfCandidate = async (req, res) => {
  try {
    const { profile, exam, body } = req;
    let end = Date.parse(exam.endingtime);
    let now = Date.parse(Date());
    if (
      now > end &&
      body &&
      body.candidateid &&
      exam.candidates.find((v) => String(v.id) === String(body.candidateid))
    ) {
      let answer = await Answer.find({
        examid: exam._id,
        candidateid: body.candidateid || profile._id,
      }).populate("candidateid", "_id name");

      res.json({
        success: true,
        message: "Answer fetched",
        data: answer[0],
      });
    } else {
      if (now < end) throw "Can't get result now";
      else throw "Candidate didn't give exam";
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message || error,
    });
  }
};
