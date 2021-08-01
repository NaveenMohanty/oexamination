require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const nodejob = require("./helpers/nodejob");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// import of routes
const authRoutes = require("./routes/auth");
const examRoutes = require("./routes/exam");
const userRoutes = require("./routes/user");
const answerRoutes = require("./routes/answer");
const SocketHelper = require("./helpers/socket");

// DB connection
mongoose.connect(process.env.DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Oexamination Database");
});
app.use("/api", authRoutes);
app.use("/api", examRoutes);
app.use("/api", userRoutes);
app.use("/api", answerRoutes);

// Port number
const PORT = process.env.PORT || 5000;

// Server running check
server.listen(PORT, () => {
  console.log("=========================================");
  console.log(`Server listening at http://localhost:${PORT}`);
});
// app.listen(PORT, () => {
//   console.log("=========================================");
//   console.log(`Server listening at http://localhost:${PORT}`);
// });

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

// Removes Examid of past exam from user upcomingexams list.
setInterval(() => {
  nodejob();
}, 30000);

// Socket implementation
SocketHelper(io);
