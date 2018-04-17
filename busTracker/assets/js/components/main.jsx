 /*
Referred from Lecture Notes
*/
import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LogIn from './login';
import Register from './register';
import store from '../store';
import Tracker from './tracker';
import Nav from './nav';



export default function main_init(root, channel){
console.log("herereerererere");
ReactDOM.render(
  <Provider store={store}>
  <Main channel={channel} root={root}/>
  </Provider>, root);
}

let Main = connect((state) => state)((props) => {
  console.log("channel ");
  console.log(props.channel);
  console.log(props.root);
    return <Router>
              <div>
                <Nav />
                <Route path="/" exact={true} render={() =>
                    <LogIn />
                } />
              <Route path="/tracker" exact={true} render={() =>
                    <Tracker root={props.root} channel={props.channel} />
                } />
              <Route path="/register" exact={true} render={() =>
                    <Register />
                } />

            </div>
          </Router>;

});



// Use jQuery to delay until page loaded.
