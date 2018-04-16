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
    location.replace("/");
  }

  console.log("props.token");
  console.log(props.token);

  return <div className="navbar-text">
            <label>Welcome, { props.token.user_id }</label> &nbsp;|&nbsp;
            <Button color="link" onClick={logout}>LogOut</Button>
          </div>;
});

function Nav(props) {
  let nav_items;
  let session_info;
  if (props.token) {
    nav_items = <ul className="navbar-nav mr-auto">
                        <NavItem>
                          <NavLink to="/tasklist" exact={true} activeClassName="active" className="nav-link">TaskList</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink to="/users" exact={true} activeClassName="active" className="nav-link">All Users</NavLink>
                        </NavItem>
                      </ul>;
    session_info = <Session token={props.token} />;
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
