// Client side code
// const socket = io("ws://localhost:3500");
const socket = io("https://simple-voting-app.onrender.com");

const progressBoxes = document.querySelectorAll(".progress-box");
const percentTags = document.querySelectorAll(".percent-tag");
const totalVotesElem = document.getElementById("totalVotes");

// Initially user not voted anyone
let vote = false;

for (let i = 0; i < progressBoxes.length; i++) {
  const element = progressBoxes[i];
  //   console.log(element);

  element.addEventListener("click", () => {
    addVote(element, element.id);
  });
}

const addVote = (element, id) => {
  // If vote is already done don't do anything (one voter only do one time voting)
  if (vote) {
    return;
  }

  let voteTo = id;
  socket.emit("send-vote", voteTo); // Sending the msg for which client user votes
  vote = true;
  element.classList.add("active");

  socket.on("receive-vote", (data) => {
    updatePolls(data);
  });

  socket.on("update", (data) => {
    updatePolls(data);
  });
};

const updatePolls = (data) => {
  let votingData = data.votingPolls;
  console.log(votingData);
  let totalVotes = data.totalVotes;

  totalVotesElem.innerHTML += totalVotes;

  // Update the progress bars for each voting option
  percentTags.forEach((percentTag, index) => {
    let vote = votingData[progressBoxes[index].id];

    // Calculate the width based on vote
    let width = Math.round((vote / totalVotes) * 100);

    // If width is 0 set the data attr to 0 otherwise the width
    percentTag.setAttribute("data", `${!width ? 0 : width}%`);
    percentTag.style.width = `${!width ? 0 : width}%`;
  });
};
