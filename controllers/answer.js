const Answer = require("../model/answer");
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
    Answer.create(
      {
        examid: exam._id,
        candidateid: profile._id,
      },
      function (err, answer) {
        if (err || !data) {
          return res
            .status(400)
            .json({ success: false, error: "Cannot create Answer" });
        }
        res.json({ success: true, answer });
      }
    );
  } else {
    return res
      .status(400)
      .json({ success: false, error: "You cannot create Answer" });
  }
};

exports.editAnswer = (req, res) => {
  const { profile, exam, answer } = req;
  let start = Date.parse(exam.startingtime);
  let end = Date.parse(exam.endingtime);
  let now = Date.parse(Date());
  if (
    exam.candidates.find((v) => String(v.id) === String(profile._id)) &&
    now > start &&
    now < end
  ) {
    //
  } else {
    return res
      .status(400)
      .json({ success: false, error: "You cannot create Answer" });
  }
};
