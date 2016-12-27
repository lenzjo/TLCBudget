// USERS CONTROLLER
var usersController = (function() {

  var User = function(id, username, password, email) {
    this.id        = id;
    this.username  = username;
    this.password  = password;
    this.email     = email;
  };

  var user_file_name  = 'userList';
  var current_user    = 'Nobody';


  // Get the list of users
  var load_user_list = function() {
    var json_str, user_list;

    json_str = localStorage.getItem(user_file_name);
    user_list = JSON.parse(json_str);
    if (user_list === null) { user_list = [];}

    return user_list;
  };


  // Save the list of users
  var save_user_list = function(user_list) {
    localStorage.setItem(user_file_name, JSON.stringify(user_list));
  };


  // Do username & password match a user on file?
  var validate_credentials = function(user) {
    var list, person;

    list = load_user_list();
    person = null;
    for (var i = 0; i < list.length; i++) {
      if (user.username !== list[i].username || user.password !== list[i].password) {
        continue;
      }
      person = list[i];
    }
    return person;
  };


  // Create a unique id
  var newID = function(list) {
    var id = 0;

    if(list.length > 0) {
      id = list[list.length - 1].id + 1;
    }
    return id;
  };





  return {

    // Get a count of users and optionally show their names
    getUsers: function(show) {
      var userCount, userList, idx;

      userList = load_user_list();
      userCount = userList.length;
      console.log('Memberships: ' + userCount + ' people are using this app.');
      if (show) {
        for  (idx = 0; idx < userList.length; idx++) {
          console.log( idx + ': ' + userList[idx].username);
        }
      }
      return userCount;
    },


    // Create and save a new user
    createUser: function(fields) {
      var id, newUser, userList;

      if(fields.username !== '' && fields.password !== '' && fields.email !== '') {
        userList = load_user_list();
        id = newID(userList);
        newUser = new User(id, fields.username, fields.password, fields.email);
        userList.push(newUser);
        save_user_list(userList);
      } else {
        newUser = null;
      }

      return newUser;
    },


    // If valid return user obj otherwise return null
    verifyUser: function(person) {
      return validate_credentials(person);
    },


    // Has username been used already?
    find_username: function(user) {
      var list, person;

      list = load_user_list();
      person = null;
      for (var i = 0; i < list.length; i++) {
        if ( user.username !== list[i].username ) {
          continue;
        }
        person = list[i];
      }
      return person;
    },


    // Has password already been used?
    find_password: function(user) {
      var list, person;

      list = load_user_list();
      person = null;
      for (var i = 0; i < list.length; i++) {
        if ( user.password !== list[i].password ) {
          continue;
        }
        person = list[i];
      }
      return person;
    },


    // Return the currently loggedin username
    getCurrentUser: function() {
      return current_user;
    },
  };

})();
