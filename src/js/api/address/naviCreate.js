import naviUpdate from './naviUpdate';

import { apiURL } from '../constants';

const naviCreate = (user, newLat, newLng, name, description) => {
  return createAddress(user, newLat, newLng, name, description);
};

//Создание адреса
function createAddress(user, newLat, newLng, name, description) {
  let token = user.token;

  return new Promise(function(resolve) {
    fetch(apiURL + 'addresses', {
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
        resolve(
          acceptAddress(token, container, naviaddress, name, description)
        );
      })
      .catch(function(error) {
        console.warn('Request failed', error);
      });
  });
}

function acceptAddress(token, container, naviaddress, name, description) {
  return new Promise(function(resolve) {
    fetch(apiURL + 'addresses/accept/' + container + '/' + naviaddress, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        container: container,
        naviaddress: naviaddress
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(createdAddress => {
        console.log('createdAddress', createdAddress);

        resolve(naviUpdate(token, container, naviaddress, name, description));
      })
      .catch(function(error) {
        console.warn('Request failed', error);
      });
  });
}

export default naviCreate;
