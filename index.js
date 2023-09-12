const express = require("express");
const http = require("http");
const fs = require("fs");
const readline = require("readline");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const logFilePath = "./logs/logs.txt";

io.on("connection", function (socket) {
  var initial_file = fs.readFileSync(logFilePath);
  var position = initial_file.length;
  fs.watch(logFilePath, (curr, prev) => {
    // fd = file descriptor
    fs.open(logFilePath, "r", function (err, fd) {
      fs.fstat(fd, function (err, stats) {
        var bufferSize = stats.size - position;
        if (bufferSize > 0) {
          var buffer = new Buffer.alloc(bufferSize);
          // fd, buffer, offset, length, position
          fs.readSync(fd, buffer, 0, bufferSize, position);
          var arr = buffer.toString("utf-8", 0, bufferSize).split("\n");
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].length > 0) {
              socket.emit("update", arr[i]);
            }
          }
        }
        position = stats.size;
      });
    });
  });
});

app.use("/", express.static(__dirname + "/public"));

server.listen(8080, function () {
  console.log("Server Started on 8080");
});

function appendNewLine() {
  setTimeout(function () {
    fs.appendFileSync(logFilePath, "\n");
    appendNewLine(); 
  }, 2000);
}

appendNewLine();
