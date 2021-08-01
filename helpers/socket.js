const Exam = require("../model/exam");
const User = require("../model/user");
const mongoose = require("mongoose");
var clients = {};
var socketRoomidMap = {};
const SocketHelper = (io) => {
  io.on("connection", (socket) => {
    socket.on("join_room", (payload) => {
      socket.join(payload.examid);

      if (clients[payload.examid]) {
        if (
          clients[payload.examid].find(
            (v) => String(v.user._id) === String(payload.user._id)
          )
        ) {
          clients[payload.examid].forEach((v, idx) => {
            if (String(v.user._id) === String(payload.user._id)) {
              let x = clients[payload.examid][idx];
              x.socketid = socket.id;
              clients[payload.examid][idx] = x;
            }
          });
        } else {
          clients[payload.examid].push({ ...payload, socketid: socket.id });
        }
      } else {
        clients[payload.examid] = [{ ...payload, socketid: socket.id }];
      }
      socketRoomidMap[socket.id] = payload.examid;
      if (payload.user.type === "host") {
        let x = clients[payload.examid].filter((v) => v.user.type !== "host");
        io.to(socket.id).emit("user_list", x);
      }
    });

    socket.on("new_join", () => {
      let x = clients[socketRoomidMap[socket.id]].find(
        (v) => String(v.socketid) === String(socket.id)
      );
      socket.to(socketRoomidMap[socket.id]).emit("user_joined", x);
    });

    socket.on("sending_signal", (payload) => {
      socket.to(payload.to).emit("receive_signal", payload);
    });

    socket.on("send_signal", (payload) => {
      socket.to(payload.to).emit("receiving_returned_signal", payload);
    });

    socket.on("disconnect", () => {
      let arr = clients[socketRoomidMap[socket.id]];
      if (arr) {
        clients[socketRoomidMap[socket.id]] = arr.filter((v) => {
          if (String(v.socketid) !== String(socket.id)) {
            return true;
          } else {
            socket.to(v.examid).emit("user_left", socket.id);
            socket.leave(v.examid);
            return false;
          }
        });

        if (clients[socketRoomidMap[socket.id]].length === 0) {
          delete clients[socketRoomidMap[socket.id]];
        }
        delete socketRoomidMap[socket.id];
      }
    });
  });
};

module.exports = SocketHelper;
