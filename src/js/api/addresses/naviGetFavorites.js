import { apiURL } from '../constants';

function naviGetFavorites(user) {
  return new Promise(function(resolve) {
    fetch(apiURL + 'Addresses/favorites?UserId=' + user.id, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'auth-token': user.token
      }
    })
      .then(response => response.json())
      .then(data => {
        resolve(data.result);
      })
      .catch(function(error) {
        console.warn('Request failed', error);
      });
  });
}

export default naviGetFavorites;
