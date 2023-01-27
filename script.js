'use strict';

// Data
const account1 = {
  owner: 'Wassim Fellah',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movSorted = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movSorted.forEach(function (movement, index, array) {
    const type = movement < 0 ? 'withdrawal' : 'deposit';
    const html = ` 
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div> 
        <div class="movements__value">${movement}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .reduce(function (acc, deposit) {
      return (account.interestRate * deposit) / 100 >= 1
        ? acc + (account.interestRate * deposit) / 100
        : acc;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
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

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.innerHTML = `${balance}€`;
};

const whenLogOutDisplay = function () {
  containerApp.style.opacity = 0;
  containerApp.style.display = 'none';
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  btnLogout.style.display = 'none';
  loginForm.style.display = 'block';
  labelWelcome.textContent = 'Log in to get started';
};

const whenLogInDisplay = function () {
  containerApp.style.opacity = 100;
  containerApp.style.display = 'grid';
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  btnLogout.style.display = 'block';
  loginForm.style.display = 'none';
};

const updateUI = function (account) {
  displayMovement(account.movements);
  calcDisplaySummary(account);
  calcDisplayBalance(account.movements);
};

//Event handlers
btnLogout.addEventListener('click', whenLogOutDisplay);

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    updateUI(currentAccount);
    whenLogInDisplay();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    Number(inputClosePin.value) === currentAccount?.pin &&
    inputCloseUsername.value === currentAccount?.userName
  ) {
    const indexOfDeletedAccount = accounts.findIndex(
      account => account.userName === inputCloseUsername.value
    );
    console.log(indexOfDeletedAccount);
    accounts.splice(indexOfDeletedAccount, 1);
    whenLogOutDisplay();
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovement(currentAccount.movements, !sorted);
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

// const allBalance = accounts
//   .map(account => account.movements)
//   .flat(1)
//   .reduce((acc, mov, i, arr) => acc + mov, 0);
// console.log(allBalance);

// const allBalance2 = accounts
//   .flatMap(account => account.movements)
//   .reduce((acc, mov, i, arr) => acc + mov, 0);
// console.log(allBalance2);
