// FILE STORAGE
var storageController = (function() {

  var transaction_file_name = 'transaction_list';

  var Transaction = function(id, type, day, month, year, description, value) {
    this.id           = id;
    this.type         = type;
    this.day          = day;
    this.month        = month;
    this.year         = year;
    this.description  = description;
    this.value        = value;
  };


  // Load a named list from localStorage
  var load_object = function(owner) {
    var list = [];

    var jsonstr = localStorage.getItem(owner + '-' + transaction_file_name);
    if(jsonstr !== null) {
      list = JSON.parse(jsonstr);
    }
    return list;
  };


  // Save a named list to localStorage
  var save_object = function(owner, list) {

    var jsonstr = JSON.stringify(list);
    localStorage.setItem(owner + '-' + transaction_file_name, jsonstr);
  };


  return {

    // Does system suport localStorage?
    supportsLocalStorage: function() {
      try {
        localStorage.setItem('_', '_');
        localStorage.removeItem('_');
        return true;
      } catch (e) {
        return false;
      }
    },


    saveItem: function(type, item, owner) {
      var transactionList, newItem;

      transactionList = load_object(owner);

      newItem = new Transaction(item.id, type, item.day, item.month, item.year, item.description, item.value);
      transactionList.push(newItem);

      save_object(owner, transactionList);
    },


    deleteItem: function(type, id, owner) {
      var transactionList, newList, index;

      transactionList = load_object(owner);
      newList = transactionList.map(function(current) {
        if( current.type === type) {
          return current.id;
        }
      });
      index = newList.indexOf(id);
      if (index !== -1) {
        transactionList.splice(index, 1);
        save_object(owner, transactionList);
      }
    },


    loadTransactionsList: function(owner) {
      var transactionList = load_object(owner);
      if (transactionList === null) {
        transactionList = [];
      }
      return transactionList;
    },

  };
})();
