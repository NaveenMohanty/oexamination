const Answer = require("../model/answer");

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

exports.createAnswer = (req, res) => {
  const { profile, exam } = req;
  let start = Date.parse(exam.startingtime);
  let end = Date.parse(exam.endingtime);
  let now = Date.parse(Date());

  if (
    exam.candidates.find((v) => String(v.id) === String(profile._id)) &&
    now > start &&
    now < end
  ) {
    var isNotThere = false;
    Answer.find(
      { examid: exam._id, candidateid: profile._id },
      function (err, answer) {
        if (err || answer.length === 0) {
          Answer.create(
            {
              examid: exam._id,
              candidateid: profile._id,
            },
            function (err, answer) {
              if (err || !answer) {
                return res
                  .status(400)
                  .json({ success: false, error: "Cannot create Answer" });
              }
              profile.examattained.push({
                examid: exam._id,
                answerid: answer._id,
              });
              profile.save(function (err, user) {
                if (err || !user) {
                  return res
                    .status(400)
                    .json({ success: false, error: "Cannot create Answer" });
                }
              });
              res.json({ success: true, answer });
            }
          );
        } else {
          res.json({ success: true, answer: answer[0] });
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ success: false, error: "You cannot create Answer" });
  }
};

exports.editAnswer = (req, res) => {
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
    let ans = answers.map((ans) => {
      let result = {
        questionid: ans.questionid,
        optionid: ans.optionid,
        mark: 0,
      };
      questions.map((ques) => {
        if (String(ques._id) === String(ans.questionid)) {
          ques.options.map((ops) => {
            if (String(ops._id) === String(ans.optionid)) {
              if (ops.isanswer) {
                marks += ques.mark;
                result.mark = ques.mark;
              }
            }
          });
        }
      });
      return result;
    });
    answer.answers = ans;
    answer.totalmark = marks;
    answer.save((err, ans) => {
      if (err || !ans) {
        return res
          .status(404)
          .json({ success: false, error: "Unable to update answer" });
      }
      res.json({ success: true, answer: ans });
    });
  } else {
    return res
      .status(400)
      .json({ success: false, error: "You cannot create Answer" });
  }
};
