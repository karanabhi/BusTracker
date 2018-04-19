/*
Referred from Lecture Notes
*/
import React from 'react';
import Search from './search';

export default function Searches(params) {
  if (localStorage.getItem("login_token") == null){
    //alert("Please Login!");
    return location.replace("/");
  }
  console.log("Searches");
  console.log(params.searches);
  let searches = _.map(params.searches, (pp) => <Search key={pp.id} search={pp} />);
  return <div className="col">
    <br/>
    { searches }
  </div>;
}
