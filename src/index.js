import './sass/styles.scss';
import { getUserInfo, getUserCreated } from './api';

('use strict');

(function() {
  let ENTER_KEYCODE = 13;
  let ESC__KEYCODE = 27;
  let loginLink = document.querySelector('.link-login');
  let modalWindow = document.querySelector('.modal-login');
  let loginForm = document.querySelector('.modal__login-form');
  let emailInput = loginForm.querySelector('#login-form-email');
  let email, password;

  function showLoginForm(evt) {
    evt.preventDefault();
    modalWindow.classList.remove('visually-hidden');
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
    if (value.length < 8 || value.lenth > 20) {
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
        emailValue = element.value;
        emailValidity = validateEmail(emailValue, element);
      } else if (element.name == 'password') {
        passwordValue = element.value;
        passwordValidity = validatePassword(passwordValue, element);
      }
      element.addEventListener('input', evt => {
        resetInputState(evt.target);
      });
    });

    if (emailValidity && passwordValidity) {
      email = emailValue;
      password = passwordValue;
      getUserAddress(email, password);
    }

    function getUserAddress(email, password) {
      getUserInfo(email, password).then(user => {
        loginLink.textContent = email;
        modalWindow.classList.add('visually-hidden');
        let addreses = getUserCreated(user);
        console.log(addreses);
      });
    }
  });
})();
