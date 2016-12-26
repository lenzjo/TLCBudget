// BUDGET CONTROLLER
var budgetController = (function() {

  var Expense = function(id, day, month, year, description, value) {
    this.id           = id;
    this.day          = day;
    this.month        = month;
    this.year         = year;
    this.description  = description;
    this.value        = value;
    this.percentage   = -1;
  };


  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };


  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };


  var Income = function(id, day, month, year, description, value) {
    this.id           = id;
    this.day          = day;
    this.month        = month;
    this.year         = year;
    this.description  = description;
    this.value        = value;
  };


  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };


  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };


  return {


    addItem: function(id, type, description, value, dateObj) {
      var newItem, day, month, year;

      day    = dateObj.day;
      month  = dateObj.month;
      year   = dateObj.year;

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(id, day, month, year, description, value);
      } else if (type === 'inc') {
        newItem = new Income(id, day, month, year, description, value);
      }
      // Add it into our data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },


    deleteItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },


    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },


    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },


    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },


    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    // Create a new ID# for the transaction type
    createID: function(type) {
      var ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      return ID;
    },


    clearBudget: function() {
      data.allItems.exp = [];
      data.allItems.inc = [];
      data.totals.exp = 0;
      data.totals.inc = 0;
      data.budget = 0;
      data.percentage = -1;
    },


    testing: function() {
      console.log(data);
    }
  };

})();
