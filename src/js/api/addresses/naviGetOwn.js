import { apiURL } from '../constants';

function naviGetOwn(user) {
  return new Promise(function(resolve) {
    fetch(apiURL + 'Addresses/my?UserId=' + user.id, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'auth-token': user.token
      }
    })
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

export default naviGetOwn;
