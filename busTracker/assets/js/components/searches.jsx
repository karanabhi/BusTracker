/*
Referred from Lecture Notes
*/
import React from 'react';
import Search from './search';

export default function Searches(params) {
  if (localStorage.getItem("login_token") == null){
    return location.replace("/");
  }
  let searches = _.map(params.searches, (pp) => <Search key={pp.id} search={pp} />);
  return <div className="container searchCards">

          { searches }

        </div>;
}
