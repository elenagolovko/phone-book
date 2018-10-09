import { apiURL } from '../constants';

function naviDelete(token, container, naviaddress) {
  //замена символа # на %23 в event
  if (naviaddress[0].toString() === '#') {
    naviaddress = '%23'.concat(naviaddress.substring(1));
  }
  console.log('deleting naviaddress', '[' + container + ']' + naviaddress);
  fetch(apiURL + 'Addresses/' + container + '/' + naviaddress, {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
      'auth-token': token
    }
  })
    .then(response => response.json())
    .then(data => {
      //TODO: доделать
      console.log('deleteNaviaddress: ', data.message);
    })
    .catch(function(error) {
      console.warn('Request failed', error);
    });
}

export default naviDelete;
