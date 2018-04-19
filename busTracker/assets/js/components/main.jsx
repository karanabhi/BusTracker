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
import Searches from './searches';



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
  console.log(props.searches);
    return <Router>
              <div>
                <Route path="/" exact={true} render={() =>
                  <LogIn />
                } />
              <Route path="/tracker" exact={true} render={() =>
                    <div>
                      <Nav />
                      <Tracker root={props.root} channel={props.channel} />
                    </div>
                } />
              <Route path="/register" exact={true} render={() =>
                    <Register />
                } />
              <Route path="/searches" render={({match}) =>
                <div>
                  <Nav />
                  <Searches searches={_.filter(props.searches, (pp) => {
                  
                      if(pp.user){

                        return parseInt(localStorage.getItem("login_id")) == pp.user.id;
                      }else{
                        return false;}
                    }
                  )} />
                </div>
                } />
            </div>
          </Router>;
});



// Use jQuery to delay until page loaded.
