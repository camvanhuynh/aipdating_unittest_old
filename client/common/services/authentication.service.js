angular.module('aipdatingApp').service('authentication', function($http, $window, $timeout) {

  var user = null;

  function initState() {
    var token = getToken();
    user = null;
    if(token) {
      //console.log("token is not null" + token);
      var payload = token.split('.')[1];
      payload = $window.atob(payload);
      payload = JSON.parse(payload);

      if (payload.exp > Date.now() / 1000) {
        user = {
          _id: payload._id,
          email: payload.email,
          name: payload.name,
          role: payload.role
        }
      };

    };

  };

  initState();

  function currentUser() {
    //console.log("currentUser email: " + user.email);
    return user;
  };

  function getToken() {
    return $window.localStorage['token'];
  }

  function loggedIn(loggedInUser,token) {
    $window.localStorage['token'] = token;
    user = {
      _id: loggedInUser._id,
      email: loggedInUser.email,
      name: loggedInUser.name,
      role: loggedInUser.role
    };
    initState();
  }

  function login(candidateUser) {
    return $http.post('/auth/login',candidateUser).then(function successCallback(res) {

      //console.log(res.user);
      user = {
        _id: res.data.user._id,
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role
      };
      //console.log("new user : " + user.email);

      // console.log("res status " + res.status);
      //console.log("res data " + res.data.token);
      // console.log(res.data);
      loggedIn(res.data.user, res.data.token);
    }, function errorCallback(err) {
      alert(err);
      $window.localStorage['token'] = '';
      user = {};
      initState();

    });
  }

  function register(user) {
    console.log("calling register");
    return $http.post('/auth/register',user).success(function(res) {
      console.log("register success");
      console.log("token is: " + res.token);
      loggedIn(res.user, res.token);
    })
  }

  function logout() {
    console.log("logging outttttttttt user");
    $window.localStorage['token'] = "";
    initState();
  }

  return {
    currentUser: currentUser,
    getToken: getToken,
    login: login,
    register: register,
    logout: logout,
  };

});
