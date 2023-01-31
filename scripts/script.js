'use strict';

// Data
const account1 = {
  owner: 'Wassim Fellah',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-01-28T23:36:17.929Z',
    '2023-01-29T10:51:36.790Z',
  ],
  currency: 'USD',
  local: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'DZD',
  local: 'fr-FR',
};

const accounts = [account1, account2];

const optionsDate = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

const optionsTime = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: 'true',
};

const backgroundPicsUrls = [
  'url(/imgs/backgroundImages/pexels-cup-of-couple-6956764.jpg)',
  'url(/imgs/backgroundImages/christian-wiediger-F8IAN0lyFJU-unsplash.jpg)',
  'url(/imgs/backgroundImages/pexels-antoni-shkraba-6207767.jpg)',
  'url(/imgs/backgroundImages/floriane-vita-FyD3OWBuXnY-unsplash.jpg)',
  'url(/imgs/backgroundImages/pexels-ono-kosuki-5999936.jpg)',
  'url(/imgs/backgroundImages/pexels-adrien-olichon-3709402.jpg)',
  'url(/imgs/backgroundImages/pexels-cup-of-couple-6634170.jpg)',
];

// Elements
const body = document.querySelector('body');
const navbar = document.querySelector('.navbar');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const loginForm = document.querySelector('.login');
const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const allFormInput = document.querySelectorAll('.form__input');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const intoDateForm = function (date) {
  const now = new Date(date);
  const day = `${now.getDate()}`.padStart(2, '0');
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

const displayDateWithApi = function (local, date, ToDisplayBalance = false) {
  if (ToDisplayBalance)
    return new Intl.DateTimeFormat(local, optionsDate).format(date);
  const now = new Date();
  const dateOfMov = new Date(date);
  let days = calcDaysPassed(dateOfMov, now);
  days = Math.round(days);
  switch (days) {
    case 0:
      return 'Today';
      break;
    case 1:
      return 'Yesterday';
      break;
    default:
      return new Intl.DateTimeFormat(local, optionsDate).format(date);
  }
};

const displayTimeWithApi = function (local, date) {
  return new Intl.DateTimeFormat(local, optionsTime).format(date);
};

const intoTimeForm = function (date) {
  const now = new Date(date);
  const hour = `${now.getHours()}`.padStart(2, '0');
  const minutes = `${now.getMinutes()}`.padStart(2, '0');
  return `${hour}:${minutes}`;
};

const displayMovement = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movSorted = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movSorted.forEach(function (movement, index, array) {
    const type = movement < 0 ? 'withdrawal' : 'deposit';
    const date = new Date(account.movementsDates[index]);
    const displayDate = displayDateWithApi(account.local, date);
    const displayTime = displayTimeWithApi(account.local, date);
    const formattedMov = formatCurrency(account, movement.toFixed(2));
    const html = ` 
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div> 
        <div class="movements__date">${displayDate}, <time class="movements__time">${displayTime}</time></div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const formatCurrency = function (account, expression) {
  return new Intl.NumberFormat(account.local, {
    currency: account.currency,
    style: 'currency',
  }).format(expression);
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  const sumIn = formatCurrency(account, Math.trunc(incomes * 100) / 100);
  labelSumIn.textContent = `${sumIn}`;
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  const sumOut = formatCurrency(
    account,
    Math.abs(Math.trunc(outcomes * 100) / 100)
  );
  labelSumOut.textContent = `${sumOut}`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .reduce(function (acc, deposit) {
      return (account.interestRate * deposit) / 100 >= 1
        ? acc + (account.interestRate * deposit) / 100
        : acc;
    }, 0);
  const sumInterest = formatCurrency(account, Math.trunc(interest * 100) / 100);
  labelSumInterest.textContent = `${sumInterest}`;
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(el => el.charAt(0))
      .join('');
  });
};
createUsernames(accounts);

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  const displayBalance = formatCurrency(
    account,
    Math.trunc(balance * 100) / 100
  );
  labelBalance.innerHTML = `${displayBalance}`;
};

const calcDaysPassed = function (date1, date2) {
  return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
};

const whenLogOutDisplay = function () {
  containerApp.style.opacity = 0;
  containerApp.style.display = 'none';
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  btnLogout.style.display = 'none';
  loginForm.style.display = 'block';
  labelWelcome.textContent = 'Log in to get started';
  allFormInput.forEach(form => (form.value = ''));
  displayMessageToUser('Log in to get started', '#444');
};

const whenLogInDisplay = function () {
  containerApp.style.opacity = 100;
  containerApp.style.display = 'grid';
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  btnLogout.style.display = 'block';
  loginForm.style.display = 'none';
  allFormInput.forEach(form => (form.value = ''));
  const now = new Date();
  const displayDate = displayDateWithApi(currentAccount.local, now, true);
  const displayTime = displayTimeWithApi(currentAccount.local, now);
  labelDate.textContent = `${displayDate}, ${displayTime}`;
};

const updateUI = function (account) {
  displayMovement(account);
  calcDisplaySummary(account);
  calcDisplayBalance(account);
};

let timerCopy;
const startLogOutTimer = function () {
  let time = 600;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      whenLogOutDisplay();
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  timerCopy = timer;
};

let picIntervalIdCopy;
const displayingBackgrounds = function () {
  body.style.background = backgroundPicsUrls[0];
  body.style.backgroundSize = 'cover';
  body.style.padding = '2rem 4rem';
  navbar.style.backgroundColor = '#f3f3f3';
  containerApp.style.margin = '2rem auto';
  let index = 1;
  const picIntervalId = setInterval(() => {
    const picture = backgroundPicsUrls[index];
    body.style.background = `${picture}`;
    body.style.backgroundSize = 'cover';
    index++;
    if (index === backgroundPicsUrls.length) index = 0;
  }, 5000);
  picIntervalIdCopy = picIntervalId;
};
displayingBackgrounds();

const stopDisplayingBackgrounds = function () {
  body.style.background = 'none';
  body.style.padding = '0 2rem';
  navbar.style.backgroundColor = '#fff';
  containerApp.style.margin = '0 auto';
  clearInterval(picIntervalIdCopy);
};

const displayMessageToUser = function (message, color) {
  clearTimeout(timeoutID);
  labelWelcome.textContent = `${message}`;
  labelWelcome.style.color = `${color}`;
};

let timeoutID;
const displayMessageToUserForTenSecond = function (message, color) {
  displayMessageToUser(message, color);
  timeoutID = setTimeout(() => {
    labelWelcome.textContent = '';
  }, 10000);
};

const displayMessageToUserInHomePage = function (message, color) {
  displayMessageToUser(message, color);
  timeoutID = setTimeout(() => {
    displayMessageToUser('Log in to get Started', '#444');
  }, 10000);
};

//Event handlers
btnLogout.addEventListener('click', function () {
  displayingBackgrounds();
  whenLogOutDisplay();
  if (timerCopy) clearInterval(timerCopy);
});

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );
  switch (true) {
    case +inputLoginPin.value === currentAccount?.pin:
      {
        labelWelcome.textContent = `Welcome back ${
          currentAccount.owner.split(' ')[0]
        }!`;
        labelWelcome.style.color = '#444';
        updateUI(currentAccount);
        whenLogInDisplay();
        startLogOutTimer();
        stopDisplayingBackgrounds();
      }
      break;
    case !currentAccount:
      {
        displayMessageToUserInHomePage('Invalid username', '#e52a5a');
      }
      break;
    case currentAccount?.pin != +inputLoginPin.value:
      {
        displayMessageToUserInHomePage('incorrect PIN', '#e52a5a');
      }
      break;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.abs(+inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.userName === inputTransferTo.value
  );
  const balance = parseFloat(labelBalance.textContent.replace(/[^\d.-]/g, ''));
  switch (true) {
    case receiverAccount?.userName != currentAccount.userName &&
      amount <= balance &&
      amount > 0 &&
      typeof receiverAccount != 'undefined':
      {
        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferAmount.blur();
        receiverAccount.movements.push(amount);
        receiverAccount.movementsDates.push(new Date().toISOString());
        clearInterval(timerCopy);
        startLogOutTimer();
        displayMessageToUserForTenSecond(
          'Operation successfully done',
          '#39b385'
        );
      }
      break;
    case !receiverAccount:
      displayMessageToUserForTenSecond('No user with this ID', '#e52a5a');
      break;
    case amount > balance:
      displayMessageToUserForTenSecond(
        'No enough money for this transfer',
        '#e52a5a'
      );
      break;
    case amount === 0:
      displayMessageToUserForTenSecond('Enter the amount', '#e52a5a');
      break;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.round(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    displayMessageToUserForTenSecond('Loaned successfully', '#39b385');
    clearInterval(timerCopy);
    startLogOutTimer();
  } else {
    if (amount === 0)
      displayMessageToUserForTenSecond('Enter amount', '#e52a5a');
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    +inputClosePin.value === currentAccount?.pin &&
    inputCloseUsername.value === currentAccount?.userName
  ) {
    const indexOfDeletedAccount = accounts.findIndex(
      account => account.userName === inputCloseUsername.value
    );
    console.log(indexOfDeletedAccount);
    accounts.splice(indexOfDeletedAccount, 1);
    whenLogOutDisplay();
    displayingBackgrounds();
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovement(currentAccount, !sorted);
  sorted
    ? (btnSort.innerHTML = '&downarrow; SORT')
    : (btnSort.innerHTML = '&uparrow; SORT');
  sorted = !sorted;
});

// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const withdrawals = movements.filter(mov => mov < 0);

const loader = document.getElementById('preloader');
window.addEventListener('load', function () {
  loader.style.display = 'none';
});
