var router = require("express").Router();
const { check, validationResult } = require("express-validator");
const {
  signup,
  signin,
  signout,
  isSignedIn,
  changepswd,
  isAuthenticated,
} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

router.post(
  "/signup",
  [
    check("name", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 9 }),
  ],
  signin
);

router.get("/signout", signout);
router.put(
  "/changepassword/:userId",
  [check("password", "password is required").isLength({ min: 9 })],
  getUserById,
  isSignedIn,
  isAuthenticated,
  changepswd
);

module.exports = router;
