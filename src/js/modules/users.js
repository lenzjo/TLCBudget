// USERS CONTROLLER
var usersController = (function() {

  var User = function(id, username, password, email) {
    this.id        = id;
    this.username  = username;
    this.password  = password;
    this.email     = email;
  };

  var user_file_name  = 'userList';
  var default_user    = 'nobody';
  var current_user    = default_user;


  // Get the list of users
  var load_user_list = function() {
    var json_str, userList;

    json_str = localStorage.getItem(user_file_name);
    userList = JSON.parse(json_str);
    if (userList === null) { userList = [];}

    return userList;
  };


  // Save the list of users
  var save_user_list = function(userList) {
    localStorage.setItem(user_file_name, JSON.stringify(userList));
  };


  // Do username & password match a user on file?
  var validate_credentials = function(user) {
    var userList, person;

    userList = load_user_list();
    person = null;
    for (var i = 0; i < userList.length; i++) {
      if (user.username !== userList[i].username || user.password !== userList[i].password) {
        continue;
      }
      person = userList[i];
    }
    return person;
  };

  // Does the username exist?
  var locate_username = function(user) {
      var userList, person;

      userList = load_user_list();
      person = null;
      for (var i = 0; i < userList.length; i++) {
        if ( user.username !== userList[i].username ) {
          continue;
        }
        person = i;
      }
      return person;
  };


  // Create a unique id
  var newID = function(userList) {
    var id = 0;

    if(userList.length > 0) {
      id = userList[userList.length - 1].id + 1;
    }
    return id;
  };


  return {


    // Get a count of users and optionally show their names
    getUsers: function(show) {
      var userCount, userList, person, idx;

      userList  = load_user_list();
      userCount = userList.length;
      person    = userCount === 1 ? 'person has' : 'people have';
      console.log('Application: ' + userCount + ' ' + person + ' registered.');
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


    // Delete a user by username
    deleteUser: function(person) {
      var userList, username, ptr, idx;

      username = person.username;             // Get the person's username
      userList = load_user_list();            // Load in the user_list

      ptr = userList.map(function(current) {
        return current.username;
      });

      idx = ptr.indexOf(username);

      if (idx !== -1) {
        userList.splice(idx, 1);              // Delete the user if found
        save_user_list(userList);             // and save back the user_list
      }
    },


    // Update a user's password
    updateUser: function(person) {
      var userList, ptr, updated;

      ptr = locate_username(person);
      if ( ptr !== null) {
        userList = load_user_list();
        userList[ptr].password = person.password;
        save_user_list(userList);
        updated = true;
      } else {
        updated =false;
      }
      return updated;
    },


    // If valid return user obj otherwise return null
    verifyUser: function(person) {
      return validate_credentials(person);
    },


    // Has username been used already?
    find_username: function(user) {
      var ptr, person, userList;

      ptr = locate_username(user);
      if ( ptr === null) {
        person = null
      } else {
        userList = load_user_list();
        person = userList[ptr];
      }
      return person;
    },


    // Do user and email belong together?
    find_email: function(user) {
      var userList, person;

      userList = load_user_list();
      person = null;
      for (var i = 0; i < userList.length; i++) {
        if ( user.email !== userList[i].email) {
          continue;
        }
        person = userList[i];
      }
      return person;
    },


    // Do user and email belong together?
    find_user_and_email: function(user) {
      var userList, person;

      userList = load_user_list();
      person = null;
      for (var i = 0; i < userList.length; i++) {
        if ( user.email !== userList[i].email || user.username !== userList[i].username) {
          continue;
        }
        person = userList[i];
      }
      return person;
    },


    // Has password already been used?
    find_password: function(user) {
      var userList, person;

      userList = load_user_list();
      person = null;
      for (var i = 0; i < userList.length; i++) {
        if ( user.password !== userList[i].password ) {
          continue;
        }
        person = userList[i];
      }
      return person;
    },


    // Return the currently logged-in username
    getCurrentUser: function() {
      return current_user;
    },


    // Set the current user
    setCurrentUser: function(username) {
      current_user = username;
    },


    // Get default user - Nobody !!
    getDefaultUser: function() {
      return default_user;
    },
  };

})();
