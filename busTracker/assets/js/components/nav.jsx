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
    //alert(localStorage.getItem("login_token"));
    location.replace("/");
  }

  console.log("props.token");
  console.log(props.token);
  var uName=localStorage.getItem("login_user_name");
  return <div className="navbar-text">
          <label>Welcome, { uName }</label> &nbsp;|&nbsp;
          <Button color="link" onClick={logout}>LogOut</Button>
          </div>;
});

function Nav(props) {
  let nav_items;
  let session_info;
  console.log("Props Token: ");
  console.log(props.token);
  console.log("Local Storage:")
  console.log(localStorage.getItem("login_token"));
  //if (props.token) {
    if (localStorage.getItem("login_token")) {
    nav_items = <ul className="navbar-nav mr-auto">
                <NavItem>
                <NavLink to="/tracker" exact={true} activeClassName="active" className="nav-link">Home</NavLink>
                </NavItem>
                <NavItem>
                <NavLink to="/searches" exact={true} activeClassName="active" className="nav-link">Search History</NavLink>
                </NavItem>
                </ul>;
    session_info = <Session token={props.token} />;
  }

  return (
    <div className="container">
<<<<<<< HEAD
      <nav className="navbar navbar-dark bg-dark navbar-expand">
        <span className="navbar-brand">
          MBTA Tracker
        </span>
        {nav_items}
        <span>
        { session_info }
        </span>
      </nav>
=======
    <nav className="navbar navbar-dark bg-dark navbar-expand">
    <span className="navbar-brand">
    Bus Tracker
    </span>
    {nav_items}
    <span>
    { session_info }
    </span>
    </nav>
>>>>>>> 6c36a2bbccdeb3ca94969f699f5fbfaf38501d68
    </div>
  );
}

function state2props(state) {
  return { token: state.token,};
}

export default connect(state2props)(Nav);
