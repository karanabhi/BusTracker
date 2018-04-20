/*
Referred from Lecture Notes
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardBody, Button } from 'reactstrap';
import api from '../api';

export default function Search(params) {

  function deleteSearch(ev,searchId){
    var p = confirm("Are you sure? If yes, press OK");
    if(p){
      api.delete_search(searchId);
    }
  }
  function searchAgain(ev,sQ){

    localStorage.setItem("searchQuery",JSON.stringify(sQ));
    //window.searchQuery = sQ;
    location.replace("/tracker");
    //console.log("aslkj");
    //console.log(window.searchQuery);
  }

  let search = params.search;


  let show_delete_button;
  if(localStorage.getItem("login_id") == search.user.id)
  {

    let searchQuery = JSON.parse(search.query);

      return(
        <div className="row searchCard">&emsp;
          <Card>
            <CardBody>
              <div>
                <p><i>Source</i>: { searchQuery.sourceName}</p>
                <p><i>Destination</i>: { searchQuery.destinationName }</p>

              </div>
              <Button onClick={(e) => searchAgain(e, searchQuery)}>Search Again</Button>
                &emsp;|&emsp;
              <Button onClick={(e) => deleteSearch(e, search.id)}>Delete</Button>
            </CardBody>
          </Card>
        </div>);
  }
  return null;
}
