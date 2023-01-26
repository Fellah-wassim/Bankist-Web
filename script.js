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

const displayMovement = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, index, array) {
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
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  btnLogout.style.display = 'none';
  loginForm.style.display = 'block';
  labelWelcome.textContent = 'Log in to get started';
};

const whenLogInDisplay = function () {
  containerApp.style.opacity = 100;
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();
  btnLogout.style.display = 'block';
  loginForm.style.display = 'none';
};

//Event handlers
btnLogout.addEventListener('click', whenLogOutDisplay);

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting to avoid refreshing
  e.preventDefault();
  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }!`;
    displayMovement(currentAccount.movements);
    calcDisplaySummary(currentAccount);
    calcDisplayBalance(currentAccount.movements);
    whenLogInDisplay();
  }
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
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const withdrawals = movements.filter(mov => mov < 0);

// const eurToUsd = 1.1;
// const movementsUsd = movements.map(mov => mov * eurToUsd);
// console.log(movementsUsd);
