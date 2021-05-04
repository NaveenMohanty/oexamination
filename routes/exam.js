var router = require("express").Router();
const { getExamById } = require("../controllers/exam");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("examId", getExamById);

module.exports = router;
