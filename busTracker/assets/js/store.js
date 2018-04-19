/*
Referred from Lecture Notes
*/
import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

function token(state = null, action) {
   switch (action.type) {
     case 'SET_TOKEN':
       return action.token;
     case 'DELETE_TOKEN':
         return Object.assign({}, state, action.token);;
     default:
       return state;
   }
}

 let empty_login = {
   email: "",
   pass: "",
 };

function login(state = empty_login, action) {
   switch (action.type) {
     case 'UPDATE_LOGIN_FORM':
       return Object.assign({}, state, action.data);
     default:
       return state;
   }
}

function searches(state = [], action) {
  switch (action.type) {
    case 'LIST_SEARCHES':
      return [...action.searches];
    case 'DELETE_SEARCH':
        return state.filter(search => search.id !== action.id);
    case 'ADD_SEARCH':
      return [action.search, ...state];
    default:
    return state;
  }
}


function root_reducer(state0, action) {
  let reducer = combineReducers({token, login, searches});
  let state1 = reducer(state0, action);
  return deepFreeze(state1);
};

let store = createStore(root_reducer);
export default store;
