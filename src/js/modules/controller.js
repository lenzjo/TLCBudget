
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl, storeCtrl, userCtrl) {

  var DOM = UICtrl.getDOMstrings();
  var MSG = UICtrl.getALERTstrings();
  var SCR = UICtrl.getSCRstrings();

  var contentDIV = document.querySelector(DOM.content_div);


  var setupEventListeners = function() {

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        enterKeyHandler();
      }
    });

    // Menu event handler
    document.querySelector(DOM.menubar).addEventListener('click', menu_handler);


    document.querySelector(DOM.container).addEventListener('click', findClickSource);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };


  var menu_handler = function(event) {
    var menuID;

    menuID = event.target.id;
    switch(menuID) {

      case DOM.menuLogin:
        console.log('You want to login');
        UICtrl.showLoginPage(contentDIV);
        break;

      case DOM.menuLogout:
        console.log('You want to logout');
        UICtrl.showLoginPage(contentDIV);
        break;

      case DOM.menuRegister:
        console.log('You want to register');
        UICtrl.showRegisterPage(contentDIV);
        break;

      default:
        break;
    }
  };


  // Find which 'screen' the CR key was pressed on
  var enterKeyHandler = function() {
    var curr_screen;

    curr_screen = UICtrl.getCurrentScreen();
console.log(curr_screen);
    switch(curr_screen) {

      case SCR.login_scr:
        loginSubmit();
        break;

      case SCR.register_scr:
        registerSubmit();
        break;

      case SCR.transactions_scr:
        ctrlAddItem();
        break;

      case SCR.lost_password:
        lostPasswordSubmit();
        break;

      default:
        break;
    }
  };


  // Find the ID clicked on in the contentDIV
  var findClickSource = function(event) {
    var eventID, validUser, entries;

    event.preventDefault();
    eventID = event.target.id;

    if (eventID === DOM.transDeleteBtn) {  // Is it a transaction DEL btn?
      ctrlDeleteItem(event);
    } else {
      switch(eventID) {

        case DOM.login_submit_btn:
          loginSubmit();
          break;

        case DOM.register_submit_btn:
          registerSubmit();
          break;

        case DOM.lost_password_submit_btn:
          lostPasswordSubmit();
          break;

        case DOM.login_link:
          UICtrl.showLoginPage(contentDIV);
          break;

        case DOM.register_link:
          UICtrl.showRegisterPage(contentDIV);
          break;

        case DOM.lost_password_link:
          UICtrl.showLostPasswordPage(contentDIV);
          break;

        default:
          break;
      }
    }
  };

  // Login Submit btn pressed
  var loginSubmit = function() {
    var entries, validUser;

    entries   = UICtrl.getLoginFieldData();
    validUser = userCtrl.verifyUser(entries);
    if (validUser !== null) {
      UICtrl.showTransactionsPage(contentDIV);
    }
  };


  // Register Submit btn pressed
  var registerSubmit = function() {
    var entries;
    entries = UICtrl.getRegisterFieldData();
    // Found the username?
    if (userCtrl.find_username(entries) !== null) {
      UICtrl.showAlert(MSG.error, MSG.usernamePresent);
    // Found the password?
    } else if (userCtrl.find_password(entries) !== null) {
      UICtrl.showAlert(MSG.error, MSG.userPWinUse);
    // Neither so go and create & save the new use.
    } else {
      if (userCtrl.createUser(entries !== null)) {
        UICtrl.showAlert(MSG.success, MSG.registered);
      } else {
        UICtrl.showAlert(MSG.error, MSG.entryError);
      }
    }
  };

  // Lost password submit btn pressed
  var lostPasswordSubmit = function() {

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
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      todaysDate = get_current_date();
      ID = budgetCtrl.createID(input.type);
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(ID, input.type, input.description, input.value, todaysDate);
      // 3. Add the item to the UI
      update_budget_UI(newItem, input.type);
      // 4. Save the transaction to storage
      storeCtrl.saveItem(input.type, newItem, user);
    } else {
      // 5. Show any errors
      if (input.description === "") {
        UICtrl.showAlert(MSG.error, MSG.missingDescription);
      }
    }
  };


  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

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
      storeCtrl.deleteItem(type, ID, user);
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


  var load_all_transactions = function(owner) {
    var transList, todaysDate, newItem, idx;

    if (!storeCtrl.storage_is_available) { return; }

    // Load transactions list
    transList = storeCtrl.loadTransactionsList(owner);
    // Are there any transactions?
    if (transList.length > 0) {
      //  1. Clear budget & display
      budgetCtrl.clearBudget();
      UICtrl.clearBudgetDisplay();
      // 2. Add each transaction to the budget & update the UI
      for (idx = 0; idx < transList.length; idx++) {
        // 2a. Get the transaction's date
        todaysDate = {
          day:    transList[idx].day,
          month:  transList[idx].month,
          year:    transList[idx].year
        };
        // 2b. Add transaction to the budget
        newItem = budgetCtrl.addItem(transList[idx].id, transList[idx].type, transList[idx].description, transList[idx].value, todaysDate);
        // 2c. Update UI
        update_budget_UI(transList[idx], transList[idx].type);
      }
    }


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
      UICtrl.clearBudgetDisplay();

      setupEventListeners();

      if (userCount > 0) {
        UICtrl.showLoginPage(contentDIV);
      } else {
        UICtrl.showRegisterPage(contentDIV);
      }
    }
  };


})(budgetController, UIController, storageController, usersController);
