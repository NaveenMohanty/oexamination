var router = require("express").Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  getUserById,
  getUser,
  updateUser,
  getUsers,
  getUserUpcomingExam,
  getUserAttainedExam,
} = require("../controllers/user");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.post("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.get("/all/user/:userId", isSignedIn, isAuthenticated, getUsers);
router.get(
  "/user/upcomingexam/:userId",
  isSignedIn,
  isAuthenticated,
  getUserUpcomingExam
);
router.get(
  "/user/examattained/:userId",
  isSignedIn,
  isAuthenticated,
  getUserAttainedExam
);
module.exports = router;
