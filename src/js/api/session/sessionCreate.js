import { apiURL } from '../constants';

function sessionCreate(email, password) {
  return new Promise(function(resolve) {
    fetch(apiURL + 'Sessions', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        password: password,
        type: 'email',
        email: email
      })
    })
      .then(response => response.json())
      .then(data => {
        //Получение токена и user-id (id нужен для получения адресов юзера, а токен - вообще для всего)
        let user = {
          id: data.id,
          token: data.token
        };
        resolve(user);
      })
      .catch(error => {
        console.warn('Request failed', error);

        const loginLink = document.querySelector('.link-login');
        loginLink.textContent = 'Личный кабинет';

        document
          .getElementById('js-errLogin')
          .classList.remove('visually-hidden');

        let inputs = document.querySelectorAll('.modal__input');
        inputs.forEach(element => {
          if (!element.classList.contains('modal__input--invalid')) {
            element.classList.add('modal__input--invalid');
          }
        });
      });
  });
}

export default sessionCreate;
