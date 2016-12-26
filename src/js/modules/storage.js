// FILE STORAGE
var storageController = (function() {

  var storage_is_available = false;

  // Filename is <owner's name>-<transaction_file_name>
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


  // Retrieve all transactions from storage and convert to obj
  var load_object = function(owner) {
    var list = [];

    var jsonstr = localStorage.getItem(owner + '-' + transaction_file_name);
    if(jsonstr !== null) {
      list = JSON.parse(jsonstr);
    }
    return list;
  };


  // Convert obj to json and save all transactions to storage
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
        storage_is_available = true;
        return storage_is_available;
      } catch (e) {
        storage_is_available = false;
        return storage_is_available;
      }
    },


    storage_is_available: function() {
      return storage_is_available;
    },


    // Save one transaction to storage
    saveItem: function(type, item, owner) {
      var transactionList, newItem;

      if (!storage_is_available) { return;}

      transactionList = load_object(owner);

      newItem = new Transaction(item.id, type, item.day, item.month, item.year, item.description, item.value);
      transactionList.push(newItem);

      save_object(owner, transactionList);
    },


    // Delete one transaction from storage
    deleteItem: function(type, id, owner) {
      var transactionList, newList, index;

      if (!storage_is_available) { return;}

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


    // Retrieve all transactions from storage
    loadTransactionsList: function(owner) {
      if (!storage_is_available) {return [];}

      var transactionList = load_object(owner);
      if (transactionList === null) {
        transactionList = [];
      }
      return transactionList;
    },

  };
})();
