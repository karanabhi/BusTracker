import store from './store';

class TheServer {


  register_user(data) {
    $.ajax("/api/v1/users", {
      method: "post",
      dataType: "json",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ user: data }),
      success: (resp) => {
        // store.dispatch({
        //   type: 'ADD_USER',
        //   user: resp.data,
        // });
        location.replace("/");
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
        if(document.getElementById("redirectToTasklist"))
          document.getElementById("redirectToTasklist").click();
      },
      // error: (msg) => {
      //   store.dispatch({
      //     type: 'SET_LOGIN_ERROR',
      //     error: msg,
      //   });
      // }
    });
  }

}

export default new TheServer();
