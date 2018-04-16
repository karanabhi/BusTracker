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
    if(props.login)
    {
      //document.getElementById("redirectToTasklist").click();
    }
    //console.log(props.login);
  }

  return( <div className="login">
            <label><h2>Please Sign In</h2></label>
            <Form >
              <FormGroup>
                <Input type="email" name="email" placeholder="Email"
                       value={props.login.email} onChange={update} />
              </FormGroup>
              <FormGroup>
                <Input type="password" name="pass" placeholder="Password"
                       value={props.login.pass} onChange={update} />
              </FormGroup>
              <Button onClick={log_in}>Log In</Button> &nbsp;
              <Link to="/register">Register</Link>
            </Form>
            <Link to="/tracker" id="redirectToTasklist" type="hidden"></Link>
          </div>);
});