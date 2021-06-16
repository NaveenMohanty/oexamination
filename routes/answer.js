var router = require("express").Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { getUserById } = require("../controllers/user");
const { getExamById } = require("../controllers/exam");
const {
  getAnswerById,
  createAnswer,
  editAnswer,
  getAnswerByhost,
  getAnswerByCandidate,
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

router.put(
  "/answer/:userId/:examId/:answerId",
  isSignedIn,
  isAuthenticated,
  editAnswer
);

router.get(
  "/host/answer/:userId",
  isSignedIn,
  isAuthenticated,
  getAnswerByhost
);
router.get(
  "/candidate/answer/:userId",
  isSignedIn,
  isAuthenticated,
  getAnswerByCandidate
);
module.exports = router;
