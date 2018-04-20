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

    localStorage.removeItem("login_token");
    localStorage.removeItem("login_id");
    localStorage.removeItem("login_user_name");

    location.replace("/");
  }

  var uName=localStorage.getItem("login_user_name");
  // return <div className="navbar-text">
  //         <label className="welcome">Welcome, <b>{ uName }</b></label> &nbsp;|&nbsp;
  //         <Button color="link" onClick={logout}>Logout</Button>
  //         </div>;

  return  <ul className="nav navbar-nav navbar-right">
            <li><label className="welcome">Welcome, <b>{ uName }</b></label>&emsp;<Button color="link" onClick={logout}>Logout</Button></li>
          </ul>;
});

function Nav(props) {
  let nav_items;
  let session_info;

  if (localStorage.getItem("login_token")) {
    // nav_items = <ul className="navbar-nav mr-auto navbar-side-item">
    //             <NavItem>
    //             <NavLink to="/tracker" exact={true} activeClassName="active" className="nav-link"><b>Home</b></NavLink>
    //             </NavItem>
    //             <NavItem>
    //             <NavLink to="/searches" exact={true} activeClassName="active" className="nav-link"><b>Search History</b></NavLink>
    //             </NavItem>
    //             </ul>;
    session_info = <Session token={props.token} />;

    nav_items = <ul className="nav navbar-nav navbar-left">
                <NavItem>
                  <NavLink to="/tracker" exact={true} activeClassName="active" className="nav-link">
                    <b>Home</b>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/searches" exact={true} activeClassName="active" className="nav-link">
                    <b>Search History</b>
                  </NavLink>
                </NavItem>
              </ul>;
  }

  function toggleNav(){
    if($("#myNavbar").hasClass('collapse'))
      $("#myNavbar").removeClass('collapse');
    else {
      $("#myNavbar").addClass('collapse');
      }
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-inverse navbar-static-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#"><b>BusTracker</b></a>
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar" aria-expanded="false" aria-controls="myNavbar"
            onClick={toggleNav}>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        <div className="collapse navbar-collapse" id="myNavbar">
          { nav_items }
          { session_info }
        </div>
  </div>
</nav>);


    // <div className="container">
    //   <nav className="navbar navbar-expand">
    //     <span className="navbar-brand">
    //       MBTA Tracker
    //     </span>
    //     {nav_items}
    //     <span>
    //     { session_info }
    //     </span>
    //   </nav>
    // </div>
  //);
}

function state2props(state) {
  return { token: state.token,};
}

export default connect(state2props)(Nav);
