var socket = io();

let logs = document.getElementById("logsdiv");


socket.on("initial_file", (msg) => {
  document.getElementById("logsdiv").innerText = msg;
});

socket.on("update", (msg) => {
  let newlogs = document.createElement("li");
  newlogs.innerText = msg;
  logs.append(newlogs);
});
