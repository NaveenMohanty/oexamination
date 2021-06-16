const Exam = require("../model/exam");
const User = require("../model/user");
const mongoose = require("mongoose");

const nodejob = async () => {
  let users = await User.find();
  let promises = users.map(async (user) => {
    let prom = user.upcomingexams.map(async (exam) => {
      let ex = await Exam.findById(exam.examid);
      let end = Date.parse(ex.endingtime);
      let now = Date.parse(Date());
      if (now > end) {
        user.upcomingexams = user.upcomingexams.filter(
          (v) => String(v.examid) !== String(ex._id)
        );
        await user.save();
      }
    });
  });
};
module.exports = nodejob;
