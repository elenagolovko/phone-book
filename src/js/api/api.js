/*----
Чтобы создать новый адрес, запускаем:
getUserInfo(email, password).then((user) => createAddress(user));

Чтобы получить избранные адреса:
getUserInfo(email, password).then((user) => getUserFavourites(user));

Чтобы получить созданные:
getUserInfo(email, password).then((user) => getUserCreated(user));

Так можно внести изменения в уже существующий адрес. Соответственно переменные
тоже должны откуда-то браться, а пока произвольно задаются
let container = 7;
let naviaddress = 703337;
let newDescription = 'Хорошее начало маршрута для пробежки 10км, но не в такую погоду';

getUserInfo(email, password).then((user) => addInfo(user.token, container, naviaddress, name, newDescription));
----*/

//Получение токена и user-id (id нужен для получения адресов юзера, а токен - вообще для всего)
export function getUserInfo(email, password) {
  return new Promise(function(resolve) {
    fetch('https://staging-api.naviaddress.com/api/v1.5/sessions', {
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

// let newLat = 55.775277;
// let newLng = 37.819246;
// let name = 'Старт';
// let description = 'Начало маршрута для пробежки 10км';

//Создание адреса
export function createAddress(user, newLat, newLng, name, description) {
  let token = user.token;
  fetch('https://staging-api.naviaddress.com/api/v1.5/addresses', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'auth-token': token
    },
    body: JSON.stringify({
      lat: newLat,
      lng: newLng,
      address_type: 'free',
      default_lang: 'ru'
    })
  })
    .then(response => response.json())
    .then(data => {
      /*Получаем номер контейнера и адрес и передаем данные дальше, для подтверждения адреса*/
      let container = data.result.container;
      let naviaddress = data.result.naviaddress;
      acceptAddress(token, container, naviaddress, name, description);
    })
    .catch(function(error) {
      console.warn('Request failed', error);
    });
}

function acceptAddress(token, container, naviaddress, name, description) {
  fetch(
    'https://staging-api.naviaddress.com/api/v1.5/addresses/accept/' +
      container +
      '/' +
      naviaddress,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        container: container,
        naviaddress: naviaddress
      })
    }
  )
    .then(() => {
      addInfo(token, container, naviaddress, name, description);
    })
    .catch(function(error) {
      console.warn('Request failed', error);
    });
}

function addInfo(token, container, naviaddress, name, description) {
  fetch(
    ' https://staging-api.naviaddress.com/api/v1.5/addresses/' +
      container +
      '/' +
      naviaddress,
    {
      method: 'put',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        lang: 'ru',
        name: name,
        description: description,
        map_visibility: 'true'
      })
      /*В body может быть много параметром, обязательные - это lang и name,
      остальные я просто для примера добавила. Надо еще доработать,
      чтоб функция могла любую инфу, которую юзер заполнил, добавлять*/
    }
  )
    .then(response => response.json())
    .then(data => {
      //TODO: доделать
      console.log('addInfo: ', data);
    })
    .catch(function(error) {
      console.warn('Request failed', error);
    });
}

//Получения избранных адресов
export function getUserFavourites(user) {
  return new Promise(function(resolve) {
    fetch(
      'https://staging-api.naviaddress.com/api/v1.5/Addresses/favorites?UserId=' +
        user.id,
      {
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'auth-token': user.token
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        resolve(data.result);
      })
      .catch(function(error) {
        console.warn('Request failed', error);
      });
  });
}

//Получение адресов, созданных юзером
export function getUserCreated(user) {
  return new Promise(function(resolve) {
    fetch(
      'https://staging-api.naviaddress.com/api/v1.5/Addresses/my?UserId=' +
        user.id,
      {
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'auth-token': user.token
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        window.addressesData = data.result;
        resolve(data.result);
      })
      .catch(function(error) {
        console.warn('Request failed', error);
      });
  });
}

export function deleteAddress(token, container, naviaddress) {
  //замена символа # на %23 в event
  if (naviaddress[0].toString() === '#') {
    naviaddress = '%23'.concat(naviaddress.substring(1));
  }
  console.log('deleting naviaddress', '[' + container + ']' + naviaddress);
  fetch(
    'https://staging-api.naviaddress.com/api/v1.5/Addresses/' +
      container +
      '/' +
      naviaddress,
    {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      //TODO: доделать
      console.log('deleteAddress: ', data.message);
    })
    .catch(function(error) {
      console.warn('Request failed', error);
    });
}

//Все адреса(избранные + созданные)
// getUserInfo(email, password)
// .then((user) => Promise.all([getUserCreated(user), getUserFavourites(user)])
// .then((res) => res[0].concat(res[1])))
