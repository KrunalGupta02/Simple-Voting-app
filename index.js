import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

httpServer.listen(3500, () => {
  console.log("Listening on port 3500");
});
let totalVotes = 0;
let votingPolls = {
  html: 0,
  css: 0,
  javascript: 0,
  react: 0,
  python: 0,
};

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.emit("update", { votingPolls, totalVotes });

  // receiving
  socket.on("send-vote", (voteTo) => {
    totalVotes += 1;
    console.log(`${socket.id} is voted to ${voteTo}`);

    // update the party vote
    votingPolls[voteTo] += 1;

    socket.broadcast.emit("receive-vote", { votingPolls, totalVotes });
    socket.emit("update", { votingPolls, totalVotes });
  });
});
