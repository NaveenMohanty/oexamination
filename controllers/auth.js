const User = require("../model/user");
const Exam = require("../model/exam");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  console.log("yes");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists",
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};
exports.changepswd = (req, res) => {
  const errors = validationResult(req);
  const { password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  User.findById(req.profile._id, function (err, user) {
    if (err || !user) {
      return res.status(400).json({
        error: "USER not found",
      });
    }
    user.password = password;
    user.save((err, user) => {
      if (err) {
        return res.status(404).send({
          error: err,
        });
      }
    });
    res.clearCookie("token");
    res.status(200).json({
      message: "Password changed successfully",
    });
  });
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isHost = (req, res, next) => {
  Exam.findOne({ _id: req.examid }, function (err, exam) {
    if (err || !exam) {
      return res.status(404).json({
        error: "Exam not found.",
      });
    }
    if (exam.host != req.profile._id) {
      return res.status(403).json({
        error: "This exam is not hosted By you.",
      });
    }
    req.exam = exam;
  });
  next();
};

exports.isCandidate = (req, res, next) => {
  Exam.findOne({ _id: req.examid }, function (err, exam) {
    if (err || !exam) {
      return res.status(404).json({
        error: "Exam not found.",
      });
    }
    const isCandidate = exam.candidates.find(
      (cand) => cand.id === req.profile._id
    );
    if (!isCandidate) {
      return res.status(403).json({
        error: "You are not in Candidate list.",
      });
    }
    req.exam = exam;
  });
  next();
};
