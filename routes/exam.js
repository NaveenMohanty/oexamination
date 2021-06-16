var router = require("express").Router();
const {
  getExamById,
  createExam,
  getExam,
  editExam,
  deleteExam,
  getUserUpcomingHostedExam,
  getUserPastHostedExam,
} = require("../controllers/exam");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("examId", getExamById);

// To get exam details by candidate and host
router.get("/exam/:examId/:userId", isSignedIn, isAuthenticated, getExam);

// To create exam by host.
router.post("/exam/:userId", isSignedIn, isAuthenticated, createExam);

// To edit exam.
router.put("/exam/:examId/:userId", isSignedIn, isAuthenticated, editExam);

// To delete exam.
router.delete(
  "/exam/delete/:examId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteExam
);

// To get user hotsed upcoming examinations.
router.get(
  "/exam/hosted/upcoming/:userId",
  isSignedIn,
  isAuthenticated,
  getUserUpcomingHostedExam
);

// To get user hotsed past examinations.
router.get(
  "/exam/hosted/past/:userId",
  isSignedIn,
  isAuthenticated,
  getUserPastHostedExam
);

module.exports = router;
