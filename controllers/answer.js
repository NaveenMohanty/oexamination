const Answer = require("../model/answer");
exports.createAnswer = () => {
  Answer.create(
    {
      examid: "608aefc32a035b1576048d68",
      candidateid: "608abfe595d213128fab3b81",
    },
    function (err, data) {
      if (err) console.log(err);
      else console.log(data);
    }
  );
};
