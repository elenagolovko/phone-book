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
    modalWindow.classList.toggle('visually-hidden');
    emailInput.focus();
  }

  function validateEmail(value) {
    if (/@{1}/i.test(value)) {
      return true;
    } else {
      //реакция для пользователя
      return false;
    }
  }

  function validatePassword(value) {
    if (value.length < 8 || value.lenth > 20) {
      //реакция для пользователя
      return false;
    } else {
      return true;
    }
  }

  loginLink.addEventListener('click', showLoginForm);
  loginLink.addEventListener('keydown', evt => {
    if (evt.keyCode === ENTER_KEYCODE) {
      //пока не работает
      modalWindow.classList.remove('visually-hidden');
    }
  });

  window.addEventListener('keydown', function(evt) {
    //тоже пока не работает, но с доступностью буду работать дальше
    if (evt.keyCode === ESC__KEYCODE) {
      if (!modalWindow.classList.contains('visually-hidden')) {
        modalWindow.classList.remove('visually-hidden');
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
        emailValidity = validateEmail(emailValue);
      } else if (element.name == 'password') {
        passwordValue = element.value;
        passwordValidity = validatePassword(passwordValue);
      }
    });

    if (emailValidity && passwordValidity) {
      email = emailValue;
      password = passwordValue;
    }

    let addreses = getUserInfo(email, password).then(user => {
      loginLink.textContent = email;
      getUserCreated(user);
    });
    console.log(addreses);
  });
})();
