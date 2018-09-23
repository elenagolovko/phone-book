import './sass/styles.scss';

('use strict');

(function() {
  let form = document.querySelector('.new-note__form');

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
})();
