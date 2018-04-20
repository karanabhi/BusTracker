import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, FormGroup, NavItem, Input, Button } from 'reactstrap';
import api from '../api';


export default class LogIn extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    if(localStorage.getItem("login_token"))
    return location.replace("/tracker");

    return <LoginForm props={this.props}/>;
  }
}

let LoginForm = connect(({login}) => {return {login};})((props) => {
  function update(ev) {

    let t = $(ev.target);
    let data = {};
    data[t.attr('name')] = t.val();
    props.dispatch({
      type: 'UPDATE_LOGIN_FORM',
      data: data,
    });
  }

  let Session = connect(({token}) => {return {token};})((props) => {

    function destroy_token(ev) {
      //ev.preventDefault();
      api.submit_logout();
    }

    return <div className="navbar-text">
      <Form inline>
        User id = {props.token.user_id} &nbsp;
        <Button onClick={destroy_token}> Logout </Button>
      </Form>
    </div>;
  });

  function log_in(ev) {
    ev.preventDefault();
    api.submit_login(props.login);
  }

  return( <div className="login">
  <label className="heading-login">Welcome to MBTA Tracker!</label><br/>
  <Form>
    <label className="signin-label">Sign In</label>
    <FormGroup>
      <div class="input-group">
        <div class="input-group-addon">
          <span class="glyphicon glyphicon-envelope"></span>
        </div>

        <Input type="email" name="email" placeholder="Email"
          value={props.login.email} onChange={update} />
      
      </div>
    </FormGroup>
    <FormGroup>
      <div class="input-group">
        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
        <Input type="password" name="pass" placeholder="Password"
          value={props.login.pass} onChange={update} />
      </div>
    </FormGroup>
    <div className="login_div">
      <Button className="btn loginbtn" onClick={log_in}><b>Log In</b></Button> &emsp; | &emsp;
        <Link className="register-button" to="/register">Register</Link>
      </div>
    </Form>
    <Link to="/tracker" id="redirectToHome" type="hidden"></Link>
  </div>);
});
