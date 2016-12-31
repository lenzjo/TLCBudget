
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl, storeCtrl, userCtrl) {

  var DOM = UICtrl.getDOMstrings();
  var MSG = UICtrl.getALERTstrings();
  var SCR = UICtrl.getSCRstrings();

  var contentDIV = document.querySelector(DOM.content_div);

  var TempUser;  // Used to temporarily store a user object

  var setupEventListeners = function() {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Find the 'screen' where the CR was pressed
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        enter_key_handler();
      }
    });
    // Menu event handler
    document.querySelector(DOM.menubar).addEventListener('click', menu_handler);
    // Get source of mouse-clicks in the content_div
    contentDIV.addEventListener('click', find_click_source);
    // React to inputType changes
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };


  //=====================  EVENT TRAFFIC STEERING  ============================

  // React to mouse-presses in the menu-bar
  var menu_handler = function(event) {
    var menuID;

    menuID = event.target.id;
    switch(menuID) {

      case DOM.menuLogin:
        console.log('You want to login');
        display_login_page();
        break;

      case DOM.menuLogout:
        console.log('You want to logout');
        userCtrl.setCurrentUser(userCtrl.getDefaultUser());
        budgetCtrl.clearBudget();
        display_login_page();
        break;

      case DOM.menuRegister:
        console.log('You want to register');
        display_registration_page();
        break;

      case DOM.menuDateToggle:
        console.log('You want to access Date display toggle');
        toggle_item_date_display();
        break;

      default:
        break;
    }
  };


  // Find which 'screen' the CR key was pressed on
  var enter_key_handler = function() {
    var curr_screen;

    curr_screen = UICtrl.getCurrentScreen();
    switch(curr_screen) {

      case SCR.login_scr:
//        login_submit();
        break;

      case SCR.register_scr:
//        register_submit();
        break;

      case SCR.transactions_scr:
        ctrlAddItem();
        break;

      case SCR.lost_password_scr:
//        lost_password_submit();
        break;

      case SCR.update_password_scr:
//        update_password_submit();
        break;

      default:
        break;
    }
  };


  // Find the ID clicked on in the contentDIV
  var find_click_source = function(event) {
    var eventID;

    event.preventDefault();
    eventID = event.target.id;
    switch(eventID) {

      case DOM.login_submit_btn:
        login_submit();
        break;

      case DOM.register_submit_btn:
        register_submit();
        break;

      case DOM.lost_password_submit_btn:
        lost_password_submit();
        break;

      case DOM.update_passwd_submit_btn:
        update_password_submit();
        break;

      case DOM.login_link:
        display_login_page();
        break;

      case DOM.register_link:
        display_registration_page();
        break;

      case DOM.lost_password_link:
        display_lost_password_page();
        break;

      case DOM.trans_delete_btn:
        ctrlDeleteItem(event.target.parentNode.parentNode.parentNode.parentNode.id);
        break;

      default:
        break;
    }
  };


//=====================  EVENT HANDLERS  ============================

  // Login Submit btn pressed
  var login_submit = function() {
    var entries, username, password, validUser;

    entries   = UICtrl.getLoginFieldData();
    username  = entries.username;
    if (username === '') {
      UICtrl.showAlert(MSG.error, MSG.missingUsername, DOM.username_field_id);
      return;
    }
    password  = entries.password;
    if (password === '') {
      UICtrl.showAlert(MSG.error, MSG.missingPassword, DOM.password_field_id);
      return;
    }
    validUser = userCtrl.verifyUser(entries);
    if (validUser !== null) {
      userCtrl.setCurrentUser(validUser.username);
      display_transaction_page();
    } else {
      UICtrl.showAlert(MSG.error, MSG.unknownUser, null);
    }
  };


  // Register Submit btn pressed
  var register_submit = function() {
    var entries, username, email, password, conpassword;

    entries = UICtrl.getRegisterFieldData();
    // Found the username?
    username = entries.username;
    if (username === '') {
      UICtrl.showAlert(MSG.error, MSG.missingUsername, DOM.username_field_id);
      return;
    } else if (userCtrl.find_username(entries) !== null) {
      UICtrl.showAlert(MSG.error, MSG.usernamePresent, DOM.username_field_id);
      return;
    }
    // Found the email?
    email = entries.password;
    if (email === '') {
      UICtrl.showAlert(MSG.error, MSG.missingEmail, DOM.email_field_id);
      return;
    } else if (userCtrl.find_email(entries) !== null) {
      UICtrl.showAlert(MSG.error, MSG.emailPresent, DOM.email_field_id);
      return;
    }
    // Found the password?
    password = entries.password;
    if (password === '') {
      UICtrl.showAlert(MSG.error, MSG.missingUsername, DOM.username_field_id);
      return;
    } else if (userCtrl.find_password(entries) !== null) {
      UICtrl.showAlert(MSG.error, MSG.passwordPresent, DOM.password_field_id);
      return;
    }
    // Are both password entries the same?
    conpassword = entries.conpassword;
    if (password !== conpassword) {
      UICtrl.showAlert(MSG.error, MSG.passwordMismatch, DOM.confirm_password_field_id);
      return;
    }
    // Correct input, so go and create & save the new use.
    if (userCtrl.createUser(entries) === null) {
      UICtrl.showAlert(MSG.error, MSG.entryError, null);
    } else {
       UICtrl.showAlert(MSG.success, MSG.registered, null);
    }
  };


  // Lost password submit btn pressed
  var lost_password_submit = function() {
    var entries, username, email, user;

    entries = UICtrl.getLostPasswordFieldData();
    // Found the username?
    username = entries.username;
    if (username === '') {
      UICtrl.showAlert(MSG.error, MSG.missingUsername, DOM.username_field_id);
      return;
    }
    // Found the email?
    email = entries.email;
    if (email === '') {
      UICtrl.showAlert(MSG.error, MSG.missingEmail, DOM.email_field_id);
      return;
    }
    // Is the user present on the system?
    user = userCtrl.find_user_and_email(entries);
     if (user === null) {
      UICtrl.showAlert(MSG.error, MSG.unknownUser, null);
      return;
    }
    // Yes, so show password update modal
    TempUser = user;
    display_update_password_page();
  };


  // Update Password Submit btn pressed
  var update_password_submit = function() {
    var entries, password, conpassword, person, updated;

    entries = UICtrl.getUpdatePasswordFieldData();
    // Found the password?
    password = entries.password;
    if (password === '') {
      UICtrl.showAlert(MSG.error, MSG.missingUsername);
      return;
    } else if (userCtrl.find_password(entries) !== null) {
      UICtrl.showAlert(MSG.error, MSG.passwordPresent, DOM.password_field_id);
      return;
    }
    // Are both password entries the same?
    conpassword = entries.conpassword;
    if (password !== conpassword) {
      UICtrl.showAlert(MSG.error, MSG.passwordMismatch, DOM.confirm_password_field_id);
      return;
    }
    // 1. Get user from temp store
    person = TempUser;
    // 3. Change password
    person.password = password;
    // 3. Update user on the system
    updated = userCtrl.updateUser(person);
    if (updated) {
      // 4a. Success - Change to Login Page
      UICtrl.showAlert(MSG.success, MSG.updateUserSuccess);
      display_login_page();
    } else {
      // 4b. Failure - Change to Lost Password Page
      UICtrl.showAlert(MSG.error, MSG.updateUserFail, null);
      display_lost_password_page();
    }
  };





//=====================  PAGE DISPLAY  ============================


  var display_transaction_page = function() {
    var i, user, transList, transaction, todayDate, newItem;

    // 1. Show Transactions page
    UICtrl.showTransactionsPage(contentDIV);
    // 2. Setup Menu choices
    UICtrl.showMenuLogout();
    UICtrl.showMenuShowDate();
    UICtrl.hideMenuRegister();
    // 3. Display User's name
    user = userCtrl.getCurrentUser();
    UICtrl.displayUser(user);
    // 4. Clear budget data structure
    budgetCtrl.clearBudget();
    // 5. Load up any transactions the user may have
    transList = storeCtrl.loadTransactionsList(user);

    for ( i = 0; i < transList.length; i++) {
      todayDate = {
        day: transList[i].day,
        month: transList[i].month,
        year: transList[i].year
      };
      newItem = budgetCtrl.addItem(transList[i].id, transList[i].type, transList[i].description, transList[i].value, todayDate);
      // 6. Add the item to the UI
      UICtrl.addListItem(newItem, transList[i].type);
      updateBudget();
      // 7. Calculate and update percentages
      updatePercentages();
    }
  };


  var display_login_page = function() {
    UICtrl.showLoginPage(contentDIV);
    UICtrl.hideMenuShowDate();
    UICtrl.showMenuLogin();
    UICtrl.showMenuRegister();
    clear_budget_display();
  };


  var display_registration_page = function() {
    UICtrl.showRegisterPage(contentDIV);
    UICtrl.showMenuLogin();
    UICtrl.hideMenuShowDate();
    UICtrl.showMenuRegister();
  };


  var display_lost_password_page = function() {
    UICtrl.showLostPasswordPage(contentDIV);
  };


  var display_update_password_page = function() {
    UICtrl.showUpdatePasswordPage(contentDIV);
  };





  var clear_budget_display = function() {

      UICtrl.displayMonth();
      UICtrl.displayUser(userCtrl.getCurrentUser());
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
  };


  var updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };


  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };


  var ctrlAddItem = function() {
    var input, newItem, ID, todaysDate;

    // 1. Get the field input data
    input = UICtrl.getInput();
    if (input.description !== "" && input.value > 0) {
      todaysDate = get_current_date();
      ID = budgetCtrl.createID(input.type);
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(ID, input.type, input.description, input.value, todaysDate);
      // 3. Add the item to the UI
      update_budget_UI(newItem, input.type);
      // 4. Save the transaction to storage
      storeCtrl.saveItem(input.type, newItem, userCtrl.getCurrentUser());
    } else {
      // 5. Show any errors
      if (input.description === "") {
        UICtrl.showAlert(MSG.error, MSG.missingDescription, DOM.inputDescription);
      } else if (isNaN(input.value)) {
        UICtrl.showAlert(MSG.error, MSG.missingAmount, DOM.inputValue);
      }
    }
  };


  var ctrlDeleteItem = function(itemID) {
    var splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
      // 5. Delete the item from storage
      storeCtrl.deleteItem(type, ID, userCtrl.getCurrentUser());
    }
  };


  // Return current date
  var get_current_date = function() {
    var dobj, day, month, year;

    dobj  = new Date();
    day   = dobj.getDate();
    month = dobj.getMonth();
    year  = dobj.getFullYear();
    var x = "" + year;
    year  = parseInt(x.slice(-2));

    return {
      day: day,
      month: month,
      year: year
    };
  };


  var update_budget_UI = function(item, type) {
    // 1. Update UI
    UICtrl.addListItem(item, type);
    // 2. Clear the fields
    UICtrl.clearFields();
    // 3. Calculate and update budget
    updateBudget();
    // 4. Calculate and update percentages
    updatePercentages();
  };



  var toggle_item_date_display = function() {
    UICtrl.toggleDateDisplay();
  };


  return {


    init: function() {
      var userCount = 0;

      console.log('Application: Started.');
      if (storeCtrl.supportsLocalStorage()) {
        console.log('File System: Available.');
        userCount = userCtrl.getUsers(true);
      } else {
        console.log('File System: Unavailable.');
      }
      clear_budget_display();

      setupEventListeners();

      if (userCount > 0) {
        display_login_page();
      } else {
        display_registration_page();
      }
    }
  };


})(budgetController, UIController, storageController, usersController);
