/*
Referred from Lecture Notes
*/
import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

/*
 *  state layout:
 *  {
 *   tasks: [... Tasks ...],
 *   users: [... Users ...],
 *   form: {
 *     user_id: "",
 *     title: "",
 *     description: "",
 *     minutes: 0,
 *     completed: false,
 *     token: ""
 *   },
 *   token:{
 *     user_id: Number,
 *     user_name: String,
 *     token: string
 *   },
 *   login: {
 *     email: string,
 *     pass: string
 *   },
 *   is_checked: boolean
 * }
 *
 * */
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




function root_reducer(state0, action) {
  //console.log("reducer", action);
  let reducer = combineReducers({token, login});
  let state1 = reducer(state0, action);
  //console.log("state1", state1);
  return deepFreeze(state1);
};

let store = createStore(root_reducer);
export default store;
