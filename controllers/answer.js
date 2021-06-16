const Answer = require("../model/answer");
const Exam = require("../model/exam");

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
      }
      res.json({
        success: true,
        message: "Exam starts now.",
        data: {
          answer_id: answer._id,
        },
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
      now < end
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
      throw "You cannot create Answer now";
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.getAnswerByhost = async (req, res) => {
  try {
    const { profile } = req;
    const { exam_id, candidate_id } = req.query;
    let exam = await Exam.findById(exam_id);
    if (String(exam.host) === String(profile._id)) {
      let answer = await Answer.find({
        examid: exam_id,
        candidateid: candidate_id,
      });
      res.json({ success: true, message: "Answer fetched", data: answer });
    } else {
      throw "You are not host of this exam";
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message || error,
    });
  }
};
exports.getAnswerByCandidate = async (req, res) => {
  try {
    const { profile } = req;
    const { answer_id } = req.query;
    let answer = await Answer.findById(answer_id);
    if (String(answer.candidateid) === String(profile._id)) {
      res.json({ success: true, message: "Answer fetched", data: answer });
    } else {
      throw "You are not candidate of this exam";
    }
  } catch (error) {
    res.json({
      success: false,
      error: error.message || error,
    });
  }
};
