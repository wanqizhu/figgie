import React from "react";
import { Route, Redirect, BrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Lobby from "./Lobby";
import Signup from "./Signup";
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-77066601-2');

// const history = createBrowserHistory();

// Initialize google analytics page view tracking
// history.listen(location => {
//   console.log("logging ", location.pathname);
//   ReactGA.set({ page: location.pathname }); // Update the user's current page
//   ReactGA.pageview(location.pathname); // Record a pageview for the given page
// });

class Gateway extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.updateUser = this.updateUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onSignup = this.onSignup.bind(this);
  }

  componentWillMount() {
    this.setState({ user: this.props.user,
                    newUser: false });
  }

  updateUser(user) {
    this.setState({ user: user });
  }

  handleLogout() {
    this.setState({ user: null });
  }

  onSignup() {
    this.setState({ newUser: true});
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/">
            <Lobby
              user={this.state.user}
              handleLogout={_ => this.handleLogout()}
            />
          </Route>

          <Route exact path="/play">
            {this.state.user ? (
              <App user={this.state.user} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route exact path="/login">
            <Login onLogin={user => this.updateUser(user)} newUser={this.state.newUser} />
          </Route>

          <Route exact path="/signup">
            <Signup onSignup={this.onSignup} />
          </Route>

          <Route
            render={function() {
              return <p />;
            }}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default Gateway;
