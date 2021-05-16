var router = require("express").Router();
const {
  getExamById,
  createExam,
  getExam,
  editExam,
  deleteExam,
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
router.get(
  "/exam/delete/:examId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteExam
);

module.exports = router;
