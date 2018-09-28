import { resetInputState } from './validation';

export default function handleModal(modalSelector, openSelector, validators) {
  let ENTER_KEYCODE = 13;
  let ESC__KEYCODE = 27;
  let modalWindow = document.querySelector(modalSelector);
  let form = modalWindow.querySelector('.modal__form');
  let createLink = document.querySelector(openSelector);
  let cancelBtn = modalWindow.querySelector('.modal__cancel');
  let result = {};

  // let latInput = form.querySelector("#newLat");

  function showForm(evt) {
    evt.preventDefault();
    modalWindow.classList.remove('visually-hidden');
    // latInput.focus();
  }

  function hideForm() {
    if (!modalWindow.classList.contains('visually-hidden')) {
      modalWindow.classList.add('visually-hidden');
      let inputs = modalWindow.querySelectorAll('.modal__input');
      inputs.forEach(element => {
        element.value = '';
        resetInputState(element);
      });
    }
  }

  createLink.addEventListener('click', showForm);
  createLink.addEventListener('keydown', evt => {
    if (evt.keyCode === ENTER_KEYCODE) {
      hideForm();
    }
  });

  cancelBtn.addEventListener('click', hideForm);

  window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ESC__KEYCODE) {
      hideForm();
    }
  });

  form.addEventListener('submit', evt => {
    evt.preventDefault();

    let inputs = evt.target.querySelectorAll('.modal__input');
    let validity;
    inputs.forEach(function(element) {
      switch (element.name) {
        case 'email':
          validity = validators.validateEmail(element.value, element);
          Object.defineProperty(result, 'validity', {
            value: validity,
            writable: true,
            enumerable: true,
            configurable: true
          });
          break;
        case 'password':
          validity = validators.validatePassword(element.value, element);
          if (validity && result.validity) {
            result.validity = true;
          } else {
            result.validity = false;
          }
          break;
        // case '':
        //   break;
        // case '':
        //   break;
      }
      Object.defineProperty(result, element.name, {
        value: element.value,
        writable: true,
        enumerable: true,
        configurable: true
      });
      element.addEventListener('input', evt => {
        resetInputState(evt.target);
        const errLogin = document.getElementById('js-errLogin');
        if (!errLogin.classList.contains('visually-hidden')) {
          errLogin.classList.add('visually-hidden');
        }
      });
    });
  });
  return result;
}
