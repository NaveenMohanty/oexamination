const Exam = require("../model/exam");
const User = require("../model/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id, function (err, user) {
    if (err || !user) {
      return res.status(404).json({
        success: false,
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  const { profile } = req;
  profile.salt = undefined;
  profile.encry_password = undefined;
  res.json({ success: true, user: profile });
};

exports.updateUser = (req, res) => {
  const { profile, body } = req;
  let data = Object.keys(body);
  data.map((v) => {
    profile[v] = body[v];
  });
  profile.save((err, user) => {
    if (err || !user) {
      return res
        .status(404)
        .json({ success: false, error: "Unable to update." });
    }
    const { name, email, userinfo } = user;
    res.json({
      success: true,
      data: { name, email, userinfo },
      message: "User updated successfully",
    });
  });
};

exports.getUsers = async (req, res) => {
  try {
    let users = await User.find();
    users = users.map((user) => {
      return new Promise((resolve, reject) => {
        try {
          let { _id, name, email } = user;
          resolve({ _id, name, email });
        } catch (error) {
          reject(error);
        }
      });
    });
    res.json({
      success: true,
      data: await Promise.all(users),
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.getUserUpcomingExam = async (req, res) => {
  try {
    let users = req.profile;
    let exams = users.upcomingexams.map((e) => {
      return new Promise(async (resolve, reject) => {
        try {
          let exam = await Exam.findById(e.examid).populate("host", "_id name");
          exam.questions = undefined;
          exam.candidates = undefined;
          return resolve(exam);
        } catch (error) {
          return reject(error);
        }
      });
    });
    res.json({
      success: true,
      data: await Promise.all(exams),
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};

exports.getUserAttainedExam = async (req, res) => {
  try {
    let users = req.profile;
    let exams = users.examattained.map((e) => {
      return new Promise(async (resolve, reject) => {
        try {
          let exam = await Exam.findById(e.examid).populate("host", "_id name");
          exam.questions = undefined;
          exam.candidates = undefined;

          return resolve(exam);
        } catch (error) {
          return reject(error);
        }
      });
    });
    res.json({
      success: true,
      data: await Promise.all(exams),
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};
