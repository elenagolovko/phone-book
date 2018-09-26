// Эти данные нужно будет получать из форм
// export const email = 'ekaterina.dony@yandex.ru';
// export const password = '71115317';
let newLat = 55.775277;
let newLng = 37.819246;
let name = 'Старт';
let description = 'Начало маршрута для пробежки 10км';

//Получение токена и user-id (id нужен для получения адресов юзера, а токен - вообще для всего)
export function getUserInfo(email, password) {
  console.log(email, password);
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
        console.log(user);
        resolve(user);
      })
      .catch(error => {
        console.log('Request failed', error);

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

//Создание адреса
function createAddress(user) {
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
      acceptAddress(token, container, naviaddress);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

function acceptAddress(token, container, naviaddress) {
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
      console.log('Request failed', error);
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
      /*В body может быть много параметром, обязательные - это lang и name, остальные я просто для примера добавила.
Надо еще доработать, чтоб функция могла любую инфу, которую юзер заполнил, добавлять*/
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log(
        data
      ); /*информацию о получившемся адресе можно посмотреть в консоли, чисто для нас, для проверки*/
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

//Получения избранных адресов
function getUserFavourites(user) {
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
        console.log(
          'Избранные:',
          data.result
        ); /*пока только в консоль выводит*/
        resolve(data.result);
      })
      .catch(function(error) {
        console.log('Request failed', error);
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
        console.log('Созданные:', data.result);
        resolve(data.result);
      })
      .catch(function(error) {
        console.log('Request failed', error);
      });
  });
}

/*----
Чтобы создать новый адрес, запускаем:
getUserInfo(email, password).then((user) => createAddress(user));

Чтобы получить избранные адреса:
getUserInfo(email, password).then((user) => getUserFavourites(user));

Чтобы получить созданные:
getUserInfo(email, password).then((user) => getUserCreated(user));

Так можно внести изменения в уже существующий адрес. Соответственно переменные тоже должны откуда-то браться, а пока произвольно задаются
let container = 7;
let naviaddress = 703337;
let newDescription = 'Хорошее начало маршрута для пробежки 10км, но не в такую погоду';

getUserInfo(email, password).then((user) => addInfo(user.token, container, naviaddress, name, newDescription));
----*/

function deleteAddress(token, container, naviaddress) {
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
      console.log(data.message);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

//Все адреса(избранные + созданные)
// getUserInfo(email, password)
// .then((user) => Promise.all([getUserCreated(user), getUserFavourites(user)])
// .then((res) => res[0].concat(res[1])))
