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
    swal({
      title: "Are you sure you want to log off?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: false,
    })
    .then((logout) => {
      if (logout) {
        props.dispatch({
          type: 'DELETE_TOKEN',
          token: {
            user_id: "",
            user_name: "",
            token: ""
          }
        });

        localStorage.removeItem("login_token");
        localStorage.removeItem("login_id");
        localStorage.removeItem("login_user_name");

        location.replace("/");

      }
    });


  }

  var uName=localStorage.getItem("login_user_name");
  return <div className="navbar-text">
          <label className="welcome">Welcome, <b>{ uName }</b></label> &nbsp;|&nbsp;
          <Button color="link" onClick={logout}>Logout</Button>
          </div>;
});

function Nav(props) {
  let nav_items;
  let session_info;

  if (localStorage.getItem("login_token")) {
    nav_items = <ul className="navbar-nav mr-auto">
                <NavItem>
                <NavLink to="/tracker" exact={true} activeClassName="active" className="nav-link"><b>Home</b></NavLink>
                </NavItem>
                <NavItem>
                <NavLink to="/searches" exact={true} activeClassName="active" className="nav-link"><b>Search History</b></NavLink>
                </NavItem>
                </ul>;
    session_info = <Session token={props.token} />;
  }



  return (
    <div className="container">
      <nav className="navbar navbar-expand">
        <span className="navbar-brand">
          MBTA Tracker
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
