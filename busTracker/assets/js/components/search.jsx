/*
Referred from Lecture Notes
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardBody, Button } from 'reactstrap';
import api from '../api';
import swal from 'sweetalert';

export default function Search(params) {

  function deleteSearch(ev,searchId){

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this search!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        api.delete_search(searchId);
        swal("Poof! Your search has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your Search is safe!");
      }
    });

  }
  function searchAgain(ev,sQ){

    localStorage.setItem("searchQuery",JSON.stringify(sQ));

    location.replace("/tracker");

  }

  let search = params.search;


  let show_delete_button;
  if(localStorage.getItem("login_id") == search.user.id)
  {

    let searchQuery = JSON.parse(search.query);

    // <Button onClick={(e) => searchAgain(e, searchQuery)}>Search Again</Button>
    //   &emsp;|&emsp;

      return(
        <div className="row searchCard">&emsp;
          <Card>
            <CardBody>
              <div>
                <p><i>Source</i>: { searchQuery.sourceName}</p>
                <p><i>Destination</i>: { searchQuery.destinationName }</p>

              </div>

              <Button className="btn-danger" onClick={(e) => deleteSearch(e, search.id)}> <span className="glyphicon glyphicon-trash"></span>&nbsp; &nbsp;Delete</Button>
            </CardBody>
          </Card>
        </div>);
  }
  return null;
}
