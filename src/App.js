import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

let suits = ["hearts", "diamonds", "clubs", "spades"];

class Player extends React.Component {
  render() {
    let cards = "";
    let playerState = this.props.playerState;
    console.log(this.props);

    suits.forEach(suit => {
      let count = playerState[suit];
      cards += count ? count + " " + suit + " " : "";
    });

    return (
      <div>
        <span class="player_id"> player #{this.props.id} </span>
        {cards}
        <span class="numCards"> {playerState.numCards} cards </span>
        <span class="money"> {playerState.money} money </span>
      </div>
    );
  }
}

class Market extends React.Component {
  render() {
    let markets = this.props.marketState;
    console.log("Market rendering, " + JSON.stringify(markets));
    if (!markets) {
      return "";
    }

    return (
      <div id="market">
        market
        {Object.entries(markets).map(([suit, suit_market]) => (
          <p>
            {suit}:{suit_market["bid"] || " no"} bid (
            {suit_market["bidPlayer"] || "n/a"}),
            {suit_market["offer"] || " no"} offer (
            {suit_market["offerPlayer"] || "n/a"}).
          </p>
        ))}
      </div>
    );
  }
}

class TradeLog extends React.Component {
  render() {
    let tradeLog = this.props.tradeLog;
    console.log("Trade log rendering, " + JSON.stringify(tradeLog));
    if (!tradeLog) {
      return "";
    }

    return (
      <div id="tradeLog">
        trade log
        {Object.values(tradeLog).map(trade => (
          <div>{trade}</div>
        ))}
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      trade_command: "",
      username: "",
      market: {},
      players: {},
      tradeLog: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const socket = socketIOClient();
    this.state.socket = socket;

    socket.on("marketUpdate", state => {
      console.log("market update");
      console.log(state);
      this.setState({ market: state });
    });

    socket.on("playerUpdate", state => {
      console.log("player update");
      console.log(state);
      this.setState({ players: state });
    });

    socket.on("tradeLogUpdate", state => {
      console.log("trade log update");
      console.log(state);
      this.setState({ tradeLog: state });
    });

    socket.on("username", state => {
      console.log("username");
      console.log(state);
      this.setState({ username: state });
    });

    socket.on("bad_command", () => {
      console.log("Bad Command");

      // this is a test to show Player props are being updated correctly
      let playerState = { ...this.state.players };
      playerState[0]["diamonds"] = 100;

      this.setState({ players: playerState });
    });
  }

  handleChange(event) {
    this.setState({ trade_command: event.target.value });
  }

  handleSubmit(event) {
    console.log("Sending command to server: " + this.state.trade_command);
    event.preventDefault();

    this.state.socket.emit("clientCommand", this.state.trade_command);
    this.setState({ trade_command: "" }); // clear form
  }

  render() {
    console.log("state", this.state);
    console.log("app is rendering itself");

    // TODO: use a render market function to force market to re-render when app updates state
    return (
      <div className="App">
        <header className="App-header">
          <div id="players">
            {Object.entries(this.state.players).map(([key, val]) => (
              <Player id={key} playerState={val}></Player>
            ))}
          </div>

          <br></br>

          <div>your name: {this.state.username}</div>

          <Market marketState={this.state["market"]} />

          <form onSubmit={this.handleSubmit}>
            <label>
              Trade:
              <input
                type="text"
                value={this.state.trade_command}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>

          <br></br>
          <br></br>

          <button onClick={() => this.state.socket.emit("startGame")}>start game</button>

          <TradeLog tradeLog={this.state["tradeLog"]} />
        </header>
      </div>
    );
  }
}

export default App;
