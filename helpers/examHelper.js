const Exam = require("../model/exam");
const User = require("../model/user");
const mongoose = require("mongoose");
const examHelper = {
  addExamIntoCandidates: async (list, examid) => {
    try {
      let promises = list.map(async (id) => {
        let user = await User.findById(id);
        user.upcomingexams.push({ examid });
        await user.save();
      });
      return await Promise.all(promises);
    } catch (error) {
      return false;
    }
  },
  deleExamIntoCandidates: async (list, examid) => {
    try {
      let promises = list.map(async (id) => {
        let user = await User.findById(id);
        user.upcomingexams = user.upcomingexams.filter(
          (v) => String(v.examid) !== String(examid)
        );
        await user.save();
      });
      return await Promise.all(promises);
    } catch (error) {
      return false;
    }
  },
  deleAnsIntoCandidates: async (answers) => {
    try {
      let promises = answers.map(async (answer) => {
        let user = await User.findById(answer.candidateid);
        user.examattained = user.examattained.filter(
          (v) => String(v.answerid) !== String(answer._id)
        );
        await user.save();
      });
      return await Promise.all(promises);
    } catch (error) {
      return false;
    }
  },
};

module.exports = examHelper;
