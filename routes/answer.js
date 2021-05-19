var router = require("express").Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { getUserById } = require("../controllers/user");
const { getExamById } = require("../controllers/exam");
const {
  getAnswerById,
  createAnswer,
  editAnswer,
} = require("../controllers/answer");

router.param("userId", getUserById);
router.param("examId", getExamById);
router.param("answerId", getAnswerById);

router.get(
  "/answer/:userId/:examId",
  isSignedIn,
  isAuthenticated,
  createAnswer
);

router.post(
  "/answer/:userId/:examId/:answerId",
  isSignedIn,
  isAuthenticated,
  editAnswer
);
module.exports = router;
