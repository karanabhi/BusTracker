import store from './store';

class TheServer {

  insertIntoSearchDb(data){

    $.ajax("/api/v1/searches", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ search: data }),
      success: (resp) => {
        store.dispatch({
          type: 'ADD_SEARCH',
          search: resp.data,
        });
      },
    });
  }
  //Get All search history data
  getSearchDBData(){
    $.ajax("/api/v1/searches", {
      method: "get",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'LIST_SEARCHES',
          searches: resp.data,
        });
      },
    });
  }

  delete_search(data) {
    $.ajax("/api/v1/searches/" + data, {
      method: "DELETE",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      success: (resp) => {
        store.dispatch({
          type: 'DELETE_SEARCH',
          id: data,
        });
      },
    });
  }

  register_user(data) {
    var login={
      email: data.email,
      pass: data.password
    }
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user: data }),
      success: (resp) => {
        this.submit_login(login);
      },
    });
  }


  submit_login(data) {

    $.ajax("/api/v1/token", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(data),
      success: (resp) => {

        store.dispatch({
          type: 'SET_TOKEN',
          token: resp,
        });

        localStorage.setItem("login_token",resp.token);
        localStorage.setItem("login_id",resp.user_id);
        localStorage.setItem("login_user_name",resp.user_name);
        //alert(localStorage.getItem("login_user_name"));

        if(document.getElementById("redirectToHome"))
          document.getElementById("redirectToHome").click();

          //alert("ksdfsrdtfygui");
          // if(document.getElementById('map-canvas')){
             //initMap();
          // }
        //alert("ksdf");
      },
      error: (msg) => {
        alert("Something went wrong!");
        // store.dispatch({
        //   type: 'SET_LOGIN_ERROR',
        //   error: msg,
        // });
      }
    });
  }

}

export default new TheServer();
