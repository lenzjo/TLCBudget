
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
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    } else {
      if (input.description === "") {
        UICtrl.showAlert(MSG.error, MSG.missingDescription);
      } else {
        if (isNaN(input.value) || input.value < 1) {
          UICtrl.showAlert(MSG.error, MSG.missingAmount);
        }
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

      setupEventListeners();
    }
  };


})(budgetController, UIController, storageController);
