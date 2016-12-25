
// UI CONTROLLER
var UIController = (function() {

  var DOMstrings = {
    inputType:          '.add__type',
    inputDescription:   '.add__description',
    inputValue:         '.add__value',
    inputBtn:           '.add__btn',
    incomeContainer:    '.income__list',
    expensesContainer:  '.expenses__list',
    budgetLabel:        '.budget__value',
    incomeLabel:        '.budget__income--value',
    expensesLabel:      '.budget__expenses--value',
    percentageLabel:    '.budget__expenses--percentage',
    container:          '.transactions',
    expensesPercLabel:  '.item__percentage',
    dateLabel:          '.budget__title--month',

    alertError:         '.alerts__msg-error',
    alertSuccess:       '.alerts__msg-success',
  };


  var alertMessages = {
    error:              'error',
    success:            'success',
    missingDescription: 'Missing Description.',
    missingAmount:      'Missing Amount',
  };


  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;

    num       = Math.abs(num);
    num       = num.toFixed(2);
    numSplit  = num.split('.');
    int       = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };


  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };


  var capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };


  return {

    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },


    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="amount"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="amount"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },


    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },


    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },


    displayBudget: function(obj) {
      var type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },


    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },


    displayMonth: function() {
      var now, months, month, year;

      now = new Date();
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },


    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },


    getDOMstrings: function() {
      return DOMstrings;
    },


    getALERTstrings: function() {
      return alertMessages;
    },


    showAlert: function(type, msg) {
      var alert;

      if (type === alertMessages.error) {
        alert = document.querySelector(DOMstrings.alertError);
      } else {
        alert = document.querySelector(DOMstrings.alertSuccess);
      }
      alert.textContent = capitalize(type) + ': ' + msg;
      alert.style.display = 'block';
      setTimeout(function() {
        alert.style.display = 'none';
      }, 2000);
    },

    hideAlerts: function() {
      var al1, al2;
      al1 = document.querySelector(DOMstrings.alertError);
      al2 = document.querySelector(DOMstrings.alertSuccess);
      al1.style.display = 'none';
      al2.style.display = 'none';
    },

  };

})();
