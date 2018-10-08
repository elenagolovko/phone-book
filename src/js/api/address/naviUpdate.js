import { apiURL } from '../constants';

function naviUpdate(token, container, naviaddress, name, description) {
  fetch(apiURL + 'addresses/' + container + '/' + naviaddress, {
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
  })
    .then(response => response.json())
    .then(data => {
      //TODO: доделать
      console.log('addInfo: ', data);
    })
    .catch(function(error) {
      console.warn('Request failed', error);
    });
}

export default naviUpdate;
