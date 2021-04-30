const Exam = require("../model/exam");
exports.userExam = () => {
  Exam.create(
    {
      examtitle: "Biology 2.45",
      host: "608abfe595d213128fab3b81",
      // questions: [
      //   {
      //     title: "What is your name",
      //     options: [
      //       { option: "Ram", isanswer: false },
      //       { option: "Sham", isanswer: true },
      //     ],
      //     mark: 4,
      //   },
      //   {
      //     title: "What is your Village name",
      //     options: [
      //       { option: "kuruda", isanswer: false },
      //       { option: "patna", isanswer: true },
      //     ],
      //     mark: 4,
      //   },
      // ],
      startingtime: "2021-04-29T14:17:09.879+00:00",
      endingtime: "2021-04-29T14:20:09.879+00:00",
      candidates: [{ id: "608abfe595d213128fab3b81" }],
    },
    function (err, data) {
      if (err) console.log(err);
      else console.log(data);
    }
  );
};
