const express = require("express");
const app = express();
const port = 8080;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

// app.get('/', (req, res) => res.send('Hello World!'))

http.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/sum/:num1/:num2", function(req, res) {
  const sum = Number(req.params.num1) + Number(req.params.num2);
  res.send("ans: " + sum);
});

var number = 5;
var suits = ["hearts", "diamonds", "clubs", "spades"];

app.get("/test", function(req, res) {
  res.send(String(number));
});

app.get("/change_test", function(req, res) {
  number += 10;
  io.emit("test", "random"); // try socket.emit later
  // socket connections seem to be working correctly thanks to server logs
  // however, either this io.emit signal is not being sent correctly, or it is not reaching
  // the client properly
  // emit server event
});

// state
state = {
  bids: {
    clubs: { bid: null, player: null },
    spades: { bid: null, player: null },
    hearts: { bid: null, player: null },
    diamonds: { bid: null, player: null }
  },
  offers: {
    clubs: { offer: null, player: null },
    spades: { offer: null, player: null },
    hearts: { offer: null, player: null },
    diamonds: { offer: null, player: null }
  }
};

io.on("connection", function(socket) {
  // on connection, server determines unique id for the socket and stores in a dictionary
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("test", () => {
    io.emit("test"); // sends to all clients, including sender
  });

  socket.on("client_command", msg => {
    console.log("server has received command: " + msg);

    // verify
    // if (msg != "hearts at 5") return false;

    // parse
    let tokens = msg.split(" ");
    console.log(tokens);
    if (tokens.length == 3) {
      // offer command
      let suit = tokens[0];
      let price = Number(tokens[2]);
      if (!suits.includes(tokens[0]) || tokens[1] != "at" || isNaN(tokens[2])) {
        socket.emit("bad_command");
        return false;
      }
      // edit state here, then send new state to client for update
      // TODO: add verification such as the new bid is better than existing bid
      state["offers"][suit]["offer"] = price;
      // TODO: add player after settling unique id for socket
      // io.emit("market_update", JSON.stringify(state));
      console.log(state);
      io.emit("market_update", state);
    } else {
      return false;
    }

    // TODO: parse, verify

    // edit state

    // emit back to all clients
    io.emit("server_update", msg);
  });
});
