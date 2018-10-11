import { apiURL } from '../constants';

function naviDelete(token, container, naviaddress) {
  //замена символа # на %23 в event
  if (naviaddress[0].toString() === '#') {
    naviaddress = '%23'.concat(naviaddress.substring(1));
  }

  return new Promise(function(resolve) {
    fetch(apiURL + 'Addresses/' + container + '/' + naviaddress, {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(
          'naviDelete: [' + container + ']' + naviaddress + ' ' + data.message
        );
        resolve(data);
      })
      .catch(function(error) {
        console.warn('Request failed', error);
      });
  });
}

export default naviDelete;
