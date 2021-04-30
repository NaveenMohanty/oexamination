require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
// const { userCreate } = require("./controllers/user");
const { userExam } = require("./controllers/exam");
const { createAnswer } = require("./controllers/answer");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// DB connection
mongoose.connect(process.env.DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Port number
const PORT = process.env.PORT || 5000;
// Server running check
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`Server listening at http://localhost:${PORT}`);
});
// DB connection check
const db = mongoose.connection;
db.on("error", (err) => {
  console.log("=========================================");
  console.log("Error:", err);
  console.log("=========================================");
});
db.once("open", () => {
  console.log("=========================================");
  console.log("DB CONNECTED");
  console.log("=========================================");
});
// userExam();
// createAnswer();
