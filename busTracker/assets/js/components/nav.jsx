/*
Referred from Lecture Notes
*/
import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { Form, FormGroup, NavItem, Input, Button } from 'reactstrap';
import api from '../api';

let Session = connect(({token}) => {return {token};})((props) => {

  function logout(ev){
    props.dispatch({
      type: 'DELETE_TOKEN',
      token: {
        user_id: "",
        user_name: "",
        token: ""
      }
    });
    alert("logout");
    localStorage.removeItem("login_token");
    localStorage.removeItem("login_id");
    localStorage.removeItem("login_user_name");
    alert(localStorage.getItem("login_token"));
    location.replace("/");
  }

  console.log("props.token");
  console.log(props.token);

  return <div className="navbar-text">
            <label>Welcome, { props.token.user_name }</label> &nbsp;|&nbsp;
            <Button color="link" onClick={logout}>LogOut</Button>
          </div>;
});

function Nav(props) {
  let nav_items;
  let session_info;
  console.log("Props Token: ");
  console.log(props.token);
  //if (props.token) {
  if (localStorage.getItem("login_token")) {
    nav_items = <ul className="navbar-nav mr-auto">
                        <NavItem>
<<<<<<< HEAD
                          <NavLink to="/tracker" exact={true} activeClassName="active" className="nav-link">Home</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink to="/searches" exact={true} activeClassName="active" className="nav-link">Search History</NavLink>
=======
                          <NavLink to="/tasklist" exact={true} activeClassName="active" className="nav-link">Recent Searches</NavLink>
>>>>>>> 1a408fe04540a14e7c8d6cfc8a4fb32ce20b0d29
                        </NavItem>

                      </ul>;
        newToken= {
            user_id: localStorage.getItem("login_user_id"),
            user_name: localStorage.getItem("login_user_name"),
            token: localStorage.getItem("login_token")
          }
    session_info = <Session token={newToken} />;
  }

  return (
    <div className="container">
      <nav className="navbar navbar-dark bg-dark navbar-expand">
        <span className="navbar-brand">
          Bus Tracker
        </span>
        {nav_items}
        <span>
        { session_info }
        </span>
      </nav>
    </div>
  );
}

function state2props(state) {
  return { token: state.token,};
}

export default connect(state2props)(Nav);
