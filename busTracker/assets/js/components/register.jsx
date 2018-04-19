import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, FormGroup, NavItem, Input, Button } from 'reactstrap';
import api from '../api';

export default class Register extends React.Component{
  constructor(props){
    super(props);
  }
  render(){

    return <RegisterForm props={this.props}/>;
  }
}

function RegisterForm(props){

  function register(ev) {
    ev.preventDefault();
    if($("#pass").val() != $("#passConf").val()){
      alert("Passwords don't match!");
    }
    let user={
        name: $("#username").val(),
        email: $("#email").val(),
        password: $("#pass").val(),
    }

    api.register_user(user);



  }

  return( <div className="login">
            <Form >
              <FormGroup>
                <Input type="text" id="username" name="username" placeholder="Name"/>
              </FormGroup>
              <FormGroup>
                <Input type="email" id="email" name="email" placeholder="Email"/>
              </FormGroup>
              <FormGroup>
                <Input type="password" id="pass" name="pass" placeholder="Password"/>
              </FormGroup>
              <FormGroup>
                <Input type="password" id="passConf" name="password_confirmation" placeholder="Confirm Password" />
              </FormGroup>


              <Button onClick={register}>Register</Button> &emsp;
              <Link to="/">Back</Link>
            </Form>
            <Link to="/tracker" id="redirectToHome" type="hidden"></Link>
          </div>);
}
