import './sass/styles.scss';
import { getUserInfo, getUserCreated, getUserFavourites } from './api';
import {
  sortByDate,
  sortAbc,
  getLocation,
  createRect,
  findNearest,
  findUpcoming,
  findType,
  findName
} from './sort';
import AdaptiveMenu from './menu';
import { createList, loadLists, clearListContainer } from './show-adr';

('use strict');

(function() {
  let ENTER_KEYCODE = 13;
  let ESC__KEYCODE = 27;
  let loginLink = document.querySelector('.link-login');
  let modalWindow = document.querySelector('.modal-login');
  let loginForm = document.querySelector('.modal__login-form');
  let emailInput = loginForm.querySelector('#login-form-email');
  let sortSelect = document.querySelector('.my-notebook__selection-parameters');
  let searchInput = document.getElementById('nav-search');
  let email, addresses;

  function showLoginForm(evt) {
    evt.preventDefault();
    modalWindow.classList.remove('visually-hidden');

    const errLogin = document.getElementById('js-errLogin');
    if (!errLogin.classList.contains('visually-hidden')) {
      errLogin.classList.add('visually-hidden');
    }
    emailInput.focus();
  }

  //reset state
  function resetInputState(element) {
    if (element.classList.contains('modal__input--invalid')) {
      element.classList.remove('modal__input--invalid');
      element.nextElementSibling.classList.add('visually-hidden');
    }
  }

  function setErrorState(element) {
    element.nextElementSibling.classList.remove('visually-hidden');
    element.classList.add('modal__input--invalid');
  }

  function validateEmail(value, element) {
    if (/@{1}/i.test(value)) {
      resetInputState(element);
      return true;
    } else {
      setErrorState(element);
      return false;
    }
  }

  function validatePassword(value, element) {
    if (value.length < 6 || value.length > 20) {
      setErrorState(element);
      return false;
    } else {
      resetInputState(element);
      return true;
    }
  }

  loginLink.addEventListener('click', showLoginForm);
  loginLink.addEventListener('keydown', evt => {
    if (
      evt.keyCode === ENTER_KEYCODE &&
      modalWindow.classList.contains('visually-hidden')
    ) {
      modalWindow.classList.remove('visually-hidden');
    }
  });

  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ESC__KEYCODE) {
      if (
        !modalWindow.classList.contains('visually-hidden') &&
        !evt.target.classList.contains('modal__input')
      ) {
        modalWindow.classList.add('visually-hidden');
      }
    }
  });

  loginForm.addEventListener('submit', evt => {
    evt.preventDefault();
    let emailValidity, passwordValidity, emailValue, passwordValue;

    let inputs = evt.target.querySelectorAll('.modal__input');
    inputs.forEach(function(element) {
      if (element.name == 'email') {
        emailValue = element.value.toLowerCase();
        emailValidity = validateEmail(emailValue, element);
      } else if (element.name == 'password') {
        passwordValue = element.value;
        passwordValidity = validatePassword(passwordValue, element);
      }
      element.addEventListener('input', evt => {
        resetInputState(evt.target);
        const errLogin = document.getElementById('js-errLogin');
        if (!errLogin.classList.contains('visually-hidden')) {
          errLogin.classList.add('visually-hidden');
        }
      });
    });

    if (emailValidity && passwordValidity) {
      email = emailValue;
      let inputs = evt.target.querySelectorAll('.modal__input');
      inputs.forEach(element => {
        element.value = '';
      });

      getUserAddress(email, passwordValue);
    }

    function getUserAddress(email, password) {
      getUserInfo(email, password)
        .then(user => getUserFavourites(user))
        .then(arr => {
          loadLists(arr);
          addresses = arr;
        })
        .then(() => {
          loginLink.textContent = 'Выход';
          modalWindow.classList.add('visually-hidden');
        });
    }
  });

  function changeOption() {
    let selectedOption = sortSelect.options[sortSelect.selectedIndex];
    switch (selectedOption.value) {
      case 'all':
        clearListContainer();
        loadLists(addresses);
        break;
      case 'alphabet':
        clearListContainer();
        loadLists(sortAbc(addresses));
        break;
      case 'addresses':
        clearListContainer();
        loadLists(findType(addresses, 'other'));
        break;
      case 'events':
        clearListContainer();
        loadLists(findType(addresses, 'event'));
        break;
      case 'date':
        clearListContainer();
        loadLists(sortByDate(addresses));
        break;
      case 'nearest':
        clearListContainer();
        getLocation()
          .then(coords => createRect(coords))
          .then(rect => loadLists(findNearest(addresses, rect)));
        break;
      case 'upcoming':
        clearListContainer();
        loadLists(findUpcoming(addresses, 3));
        break;
    }
  }
  sortSelect.addEventListener('change', changeOption);

  //поиск по названию
  searchInput.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      loadLists(findName(addresses, searchInput.value));
    }
  });
  //адаптивное меню
  AdaptiveMenu();
})();
