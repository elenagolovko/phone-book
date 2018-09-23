import './sass/styles.scss';
import { getUserInfo, email, password, getUserCreated } from './api';

('use strict');

(function() {
  let form = document.querySelector('.new-note__form');
  let adresesList = document.querySelector('.my-notebook__list');

  form.addEventListener('submit', evt => {
    evt.preventDefault();
    // if (checkValidity(value)) {
    // window.backend.save(new FormData(form), function () {
    //   при удачном отправлении
    // }, function () {
    //   document.querySelector('.input__error').classList.remove('visually-hidden');
    // });
    // }
  });

  getUserInfo(email, password).then(user => getUserCreated(user));
})();
