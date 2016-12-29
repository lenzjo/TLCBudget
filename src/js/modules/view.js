
// UI CONTROLLER
var UIController = (function() {

  var DOMstrings = {
    inputType:                '.add__type',
    inputDescription:         '.add__description',
    inputValue:               '.add__value',
    inputBtn:                 '.add__btn',
    incomeContainer:          '.income__list',
    expensesContainer:        '.expenses__list',
    budgetLabel:              '.budget__value',
    incomeLabel:              '.budget__income--value',
    expensesLabel:            '.budget__expenses--value',
    percentageLabel:          '.budget__expenses--percentage',
    content_div:              '.content_area',
    expensesPercLabel:        '.item__percentage',
    dateLabel:                '.budget__title--month',
    userLabel:                '.budget__title--user',

    item_date:                '.item__date',

    alertError:               '.alerts__msg-error',
    alertSuccess:             '.alerts__msg-success',

    menubar:                  '.menubar',
    menuLogin:                'menu__login--link',
    menuLogout:               'menu__logout--link',
    menuRegister:             'menu__register--link',
    menuShowDate:             'menu__show_date--link',
    menuDateStatus:           '.menu__date',

    menuLoginLink:            '#menu__login--link',
    menuLogoutLink:           '#menu__logout--link',
    menuRegisterLink:         '#menu__register--link',
    menuShowDateLink:         '#menu__show_date--link',

    username_field:           'username',
    password_field:           'password',
    confirm_password_field:   'conpassword',
    email_field:              'email',

    trans_delete_btn:         'trans_del_btn',
    login_submit_btn:         'login_submit_btn',
    register_submit_btn:      'register_submit_btn',
    lost_password_submit_btn: 'lost_password_submit_btn',
    update_passwd_submit_btn: 'update_password_submit_btn',

    login_link:               'login_link',
    register_link:            'register_link',
    lost_password_link:       'lost_password_link',

  };


  var alertMessages = {
    error:              'error',
    success:            'success',

    missingDescription: 'You need to give a short Description.',
    missingAmount:      'How much was the Transaction?',
    missingUsername:    'What is your username?',
    missingPassword:    'Please enter your password.',
    missingEmail:       'Please enter your email address.',
    usernamePresent:    'Username is already in use.',
    emailPresent:       'Email is already in use.',
    passwordPresent:    'You cannot use that password.',
    passwordMismatch:   'The password entries do not match.',
    unknownUser:        'That username and password combo does not exist on the system.',
    userPWinUse:        'Username and password combination already in use.',
    entryError:         'Bad input... Try again.',
    registered:         'You have successfully registered, go login.',
    updateUserFail:     'Could not save new password, please re-register',
    updateUserSuccess:  'Successfully updated Password.',
  };


  var screens = {
    transactions_scr:     'transaction_scr',
    login_scr:            'login_scr',
    register_scr:         'register_scr',
    lost_password_scr:    'lost_password',
    update_password_scr:  'update_password',
  };

  var current_screen = '';

  var pages = {
    transaction_page:     '/pages/transactions.html',
    login_page:           '/pages/login.html',
    register_page:        '/pages/register.html',
    lost_password_page:   '/pages/lost_password.html',
    update_password_page: '/pages/update_password.html',
  };


  var formatNumber = function(num, type) {
    var numSplit, int, dec;

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


  var format_date = function(day, month, year) {
    var dateStr = '';

    if (day < 10) { day = '0' + day; }
    month++;
    if (month < 10) {month = '0' + month; }
    dateStr = day + '/' + month + '/' + year;

    return dateStr;
  };


  var formatDate = function(day, month, year) {
    var dateStr = '';

    if (day < 10) { day = '0' + day; }
    month++;                              // mths are 0-11 so add 1
    if (month < 10) {month = '0' + month; }

    dateStr = day + '/' + month + '/' + year;
    return dateStr;
  };


  //===========  'PRIVATE' PAGE RELATED FUNCTIONS ============================

  // Change the contents of a div on the index page
  var change_content = function(targetDIV, partial, callback) {
    var http = new XMLHttpRequest();
    http.open('GET', partial, false);
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        targetDIV.innerHTML = http.responseText;
        callback();
      }
    };
    http.send();
  };


  var iniz_transaction_screen = function() {
    var fields, fieldsArr;

    fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
    fieldsArr = Array.prototype.slice.call(fields);
    fieldsArr.forEach(function(current, index, array) {
      current.value = '';
    });
    fieldsArr[0].focus();
  };


  var iniz_login_form = function() {
    var input;

    document.getElementById(DOMstrings.password_field).value = '';
    input = document.getElementById(DOMstrings.username_field);
    input.value = '';
    input.focus();
    current_screen = screens.login_scr;
  };


  var iniz_register_form = function() {
    document.getElementById(DOMstrings.email_field).value = '';
    document.getElementById(DOMstrings.password_field).value = '';
    document.getElementById(DOMstrings.confirm_password_field).value = '';
    var input = document.getElementById(DOMstrings.username_field);
    input.value = '';
    input.focus();
    current_screen = screens.register_scr;
  };


  var iniz_lost_password_form = function() {
    document.getElementById(DOMstrings.email_field).value = '';
    var input = document.getElementById(DOMstrings.username_field);
    input.value = '';
    input.focus();
    current_screen = screens.lost_password_scr;
  };


  var iniz_update_password_form = function() {
    document.getElementById(DOMstrings.password_field).value = '';
    var input = document.getElementById(DOMstrings.confirm_password_field);
    input.value = '';
    input.focus();
    current_screen = screens.update_password_scr;
  };



  return {
    // ======================  'PUBLIC FUNCTIONS  ============================

    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },


    addListItem: function(obj, type) {
      var html, newHtml, element, dateStr;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item" id="inc-%id%"><div class="item__blk"><div class="item__date">%trans_date%</div><div class="item__description">%description%</div></div><div class="amount"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" id="trans_del_btn"></i></button></div></div></div>';

      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item" id="exp-%id%"><div class="item__blk"><div class="item__date" >%trans_date%</div><div class="item__description">%description%</div></div><div class="amount"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" id="trans_del_btn"></i></button></div></div></div>';
      }
      // Convert d,m,y to a string dd/mm/yy
      dateStr = formatDate(obj.day, obj.month, obj.year);
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%trans_date%', dateStr + ': ');
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


    getSCRstrings: function() {
      return screens;
    },


    showAlert: function(type, msg) {
      var alert, nonAlert, errAlert, sucAlert;

      errAlert = document.querySelector(DOMstrings.alertError);
      sucAlert = document.querySelector(DOMstrings.alertSuccess);
      if (type === alertMessages.error) {
        alert = errAlert;
        nonAlert = sucAlert;
      } else {
        alert = sucAlert;
        nonAlert = errAlert;
      }
      alert.textContent        = capitalize(type) + ': ' + msg;
      alert.style.display      = 'block';
      nonAlert.style.display   = 'none';
      setTimeout(function() {
        alert.style.display= 'none';
      }, 2000);
    },


    toggleDateDisplay: function() {
      var dateStatus, dateColor;

      dateStatus = document.querySelector(DOMstrings.menuDateStatus);
      // What color is the dateStatus?
      dateColor = document.defaultView.getComputedStyle(dateStatus,null).getPropertyValue('color');

      if (dateColor === 'rgb(255, 204, 204)') {    // Is it ON?
        dateStatus.style.color = 'rgb(255, 255, 204)';
        dateStatus.textContent = 'OFF';
        this.hideItemDate();
      } else {
        dateStatus.style.color = 'rgb(255, 204, 204)';
        dateStatus.textContent = 'ON';
        this.showItemDate();
      }
    },


    hideItemDate: function() {
      var itemDates;

      itemDates = document.querySelectorAll(DOMstrings.item_date);

      nodeListForEach(itemDates, function(cur) {
        cur.classList.toggle('hide-date');
      });
    },


    showItemDate: function() {
      var itemDates;

      itemDates = document.querySelectorAll(DOMstrings.item_date);

      nodeListForEach(itemDates, function(cur) {
        cur.classList.toggle('hide-date');
      });
    },





    //=================  PAGE RELATED FUNCTIONS  ========================


    showTransactionsPage: function(target_div) {
      change_content(target_div, pages.transaction_page, iniz_transaction_screen );
      current_screen = screens.transactions_scr;
    },

    clearTransactionPage: function() {
      iniz_transaction_screen();
    },


    showLoginPage: function(target_div) {
      change_content(target_div, pages.login_page, iniz_login_form);
      current_screen = screens.login_scr;
    },


    clearLoginForm: function() {
      iniz_login_form();
    },


    showRegisterPage: function(target_div) {
      change_content(target_div, pages.register_page, iniz_register_form);
      current_screen = screens.register_scr;
    },

    clearRegisterForm: function() {
      iniz_register_form();
    },


    showLostPasswordPage: function(target_div) {
      change_content(target_div, pages.lost_password_page, iniz_lost_password_form);
      current_screen = screens.lost_password_scr;
    },

    clearLostPasswordForm: function() {
      iniz_lost_password_form();
    },


    showUpdatePasswordPage: function(target_div) {
      change_content(target_div, pages.update_password_page, iniz_update_password_form);
      current_screen = screens.update_password_scr;
    },

    clearUpdatePasswordForm: function() {
      iniz_update_password_form();
    },


    // Return un & pw in an object
    getLoginFieldData: function() {
      var username, password;

      username = document.getElementById(DOMstrings.username_field).value;
      password = document.getElementById(DOMstrings.password_field).value;

      return {
        username: username,
        password: password
      };
    },


    // Return un, pw, conpw & email in an object
    getRegisterFieldData: function() {
      var username, password, conpassword, email;

      username    = document.getElementById(DOMstrings.username_field).value;
      password    = document.getElementById(DOMstrings.password_field).value;
      conpassword = document.getElementById(DOMstrings.confirm_password_field).value;
      email       = document.getElementById(DOMstrings.email_field).value;

      return {
        username:    username,
        password:    password,
        conpassword: conpassword,
        email:       email
      };
    },


    // Return un & email in an object
    getLostPasswordFieldData: function() {
      var username, password, conpassword, email;

      username    = document.getElementById(DOMstrings.username_field).value;
      email       = document.getElementById(DOMstrings.email_field).value;

      return {
        username:    username,
        email:       email
      };
    },


    // Return pw & conpw in an object
    getUpdatePasswordFieldData: function() {
      var password, conpassword;

      password    = document.getElementById(DOMstrings.password_field).value;
      conpassword = document.getElementById(DOMstrings.confirm_password_field).value;

      return {
        password:    password,
        conpassword: conpassword
      };
    },


    showMenuRegister: function() {
      var DOMreg;

      DOMreg  = document.getElementById(DOMstrings.menuRegister);
      DOMreg.style.display = 'block';
    },

    hideMenuRegister: function() {
      var DOMreg;

      DOMreg  = document.getElementById(DOMstrings.menuRegister);
      DOMreg.style.display = 'none';
    },


    showMenuLogin: function() {
      var DOMin, DOMout;

      DOMin  = document.getElementById(DOMstrings.menuLogin);
      DOMout = document.getElementById(DOMstrings.menuLogout);

      DOMin.style.display = 'block';
      DOMout.style.display ='none';
    },


    showMenuLogout: function() {
      var DOMin, DOMout;

      DOMin  = document.getElementById(DOMstrings.menuLogin);
      DOMout = document.getElementById(DOMstrings.menuLogout);

      DOMin.style.display = 'none';
      DOMout.style.display ='block';
    },


    hideMenuShowDate: function() {
      var DOMpref, DOMstatus;

      DOMpref  = document.getElementById(DOMstrings.menuShowDate);
      DOMstatus = document.querySelector(DOMstrings.menuDateStatus);
      DOMpref.style.display = 'none';
      DOMstatus.style.display = 'none';
    },


    showMenuShowDate: function() {
      var DOMpref;

      DOMpref  = document.getElementById(DOMstrings.menuShowDate);
      DOMstatus = document.querySelector(DOMstrings.menuDateStatus);
      DOMpref.style.display = 'block';
      DOMstatus.style.display = 'block';
    },


    getCurrentScreen: function() {
      return current_screen;
    },


    displayUser: function(user) {
      document.querySelector(DOMstrings.userLabel).textContent = capitalize(user);
    },

  };
})();
