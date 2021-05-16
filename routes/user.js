var router = require("express").Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById, getUser, updateUser } = require("../controllers/user");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.post("/user/:userId", isSignedIn, isAuthenticated, updateUser);
module.exports = router;
