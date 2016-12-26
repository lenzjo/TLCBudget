
// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl, storeCtrl) {

  var DOM = UICtrl.getDOMstrings();
  var MSG = UICtrl.getALERTstrings();

  var user = 'clive';    // For temp. use while bulding filesystem.


  var setupEventListeners = function() {

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
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
      console.log('Application: Started.');
      if (storeCtrl.supportsLocalStorage()) {
        console.log('File System: Available.');
      } else {
        console.log('File System: Unavailable.');
      }
      UICtrl.clearBudgetDisplay();
      load_all_transactions(user);

      setupEventListeners();
    }
  };


})(budgetController, UIController, storageController);
