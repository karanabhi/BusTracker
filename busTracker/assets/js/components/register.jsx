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
    if($("#pass").val() != $("#passConf").val()){
      swal("Passwords do not match", "Please try again", "error");
    }
    else {
      swal({
        title: "Registration Successful!",
        text: "",
        icon: "success",
        button: "Okay",
        dangerMode: false,
      })
      .then((ok) => {
        if (ok) {
          ev.preventDefault();

          let user={
              name: $("#username").val(),
              email: $("#email").val(),
              password: $("#pass").val(),
          }

          api.register_user(user);

        }
      });
    }

    //swal("Registration Successful!", "", "success");




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


              <Button className="btn btn-primary" onClick={register}>Register</Button> &emsp;
              <Link to="/">Back</Link>
            </Form>
            <Link to="/tracker" id="redirectToHome" type="hidden"></Link>
          </div>);
}
