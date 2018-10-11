import {
  sessionCreate,
  geolocationGet,
  naviGetOwn,
  naviGetFavorites
} from '../api/index';
import { showMyAdresses, showFavorites, cleanSliders } from '../slider';
import openNaviBook from './htmlOpenNaviBook';

function getUserAddress(email, password) {
  let loginLink = document.querySelector('.link-login');
  let actionButtons = document.querySelectorAll('.action-buttons__button');

  loginLink.textContent = 'Загрузка данных ...';

  return new Promise(function(resolve) {
    sessionCreate(email, password)
      .then(user => {
        openNaviBook();
        geolocationGet();

        return Promise.all([naviGetFavorites(user), naviGetOwn(user)]);
      })
      .then(arrAddresses => {
        for (let i = 0; i < actionButtons.length; i++) {
          actionButtons[i].classList.remove('action-buttons__button--disabled');
        }

        cleanSliders();
        showFavorites(arrAddresses[0]);
        showMyAdresses(arrAddresses[1]);

        resolve(arrAddresses);
      });
  });
}

export default getUserAddress;
