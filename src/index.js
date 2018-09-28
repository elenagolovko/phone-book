import './sass/styles.scss';
import {
  getUserInfo,
  getUserCreated,
  getUserFavourites,
  createAddress
} from './api';
import {
  sortByDate,
  sortAbc,
  getLocation,
  createRect,
  findNearest,
  findUpcoming,
  findType,
  findName
} from './sort';
import AdaptiveMenu from './menu';
import { createList, loadLists, clearListContainer } from './show-adr';
import handleModal from './modal';
import { validatePos, validateEmail, validatePassword } from './validation';

('use strict');

(function() {
  let ENTER_KEYCODE = 13;
  // let ESC__KEYCODE = 27;
  let loginLink = document.querySelector('.link-login');
  let modalLoginWindow = document.querySelector('.modal-login');
  let loginForm = document.querySelector('.modal__login-form');
  let sortSelect = document.querySelector('.my-notebook__selection-parameters');
  let searchInput = document.getElementById('nav-search');
  let createForm = document.querySelector('.new-note__form');
  let searchButton = document.querySelector('.search__button');
  let sortButton = document.querySelector('.sort__button');

  let addresses;

  function getLoginInfo() {
    return handleModal('.modal-login', '.link-login', {
      validateEmail,
      validatePassword
    });
  }

  function getNewAddressInfo() {
    return handleModal('.modal__new-note', '.create__button', {
      validatePos
    });
  }

  function getSearchInfo() {
    return handleModal('.modal__search', '.search__button', {});
  }

  function getSortInfo() {
    return handleModal('.modal__sort', '.sort__button', {});
  }

  let loginInfo = getLoginInfo();
  let newAddressInfo = getNewAddressInfo();
  let searchInfo = getSearchInfo();
  let sortInfo = getSortInfo();

  loginLink.addEventListener('click', evt => {
    if (evt.target.classList.contains('js-authorized')) {
      evt.target.classList.remove('js-authorized');

      evt.target.textContent = 'Личный кабинет';
      //Удалить меню для личного кабинета
      const menuLinks = document.querySelectorAll('#js-navigation__list li');
      for (let i = 0; i < menuLinks.length - 1; i++) {
        menuLinks[i].classList.add('visually-hidden');
      }
      //Убрать со страницы список адресов
      clearListContainer();

      //показать приветственный текст
      const welcomeBlock = document.getElementById('js-welcomeBlock');
      console.log(welcomeBlock);
      welcomeBlock.classList.remove('visually-hidden');
    } else {
      modalLoginWindow.classList.remove('visually-hidden');
    }
  });

  loginForm.addEventListener('submit', () => {
    function getUserAddress(email, password) {
      getUserInfo(email, password)
        .then(user => getUserFavourites(user))
        .then(arr => {
          loadLists(arr);
          addresses = arr;
        })
        .then(() => {
          loginLink.textContent = 'Выход';
          loginLink.classList.add('js-authorized');
        });
    }

    getLoginInfo();
    console.log(loginInfo);

    if (!loginInfo.validity) {
      return;
    }
    getUserAddress(loginInfo.email, loginInfo.password);
  });

  createForm.addEventListener('submit', () => {
    getNewAddressInfo();

    getUserInfo(loginInfo.email, loginInfo.password).then(user =>
      createAddress(
        user,
        newAddressInfo.newLat,
        newAddressInfo.newLng,
        newAddressInfo.name,
        newAddressInfo.description
      )
    );

    console.log(newAddressInfo);
  });

  searchButton.addEventListener('click', () => {
    getSearchInfo();

    //поиск по названию
    searchInput.addEventListener('keydown', function(evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        evt.preventDefault();
        loadLists(findName(addresses, searchInput.value));
      }
    });
  });

  sortButton.addEventListener('click', () => {
    getSortInfo();

    function changeOption() {
      let selectedOption = sortSelect.options[sortSelect.selectedIndex];
      switch (selectedOption.value) {
        case 'all':
          clearListContainer();
          loadLists(addresses);
          break;
        case 'alphabet':
          clearListContainer();
          loadLists(sortAbc(addresses));
          break;
        case 'addresses':
          clearListContainer();
          loadLists(findType(addresses, 'other'));
          break;
        case 'events':
          clearListContainer();
          loadLists(findType(addresses, 'event'));
          break;
        case 'date':
          clearListContainer();
          loadLists(sortByDate(addresses));
          break;
        case 'nearest':
          clearListContainer();
          getLocation()
            .then(coords => createRect(coords))
            .then(rect => loadLists(findNearest(addresses, rect)));
          break;
        case 'upcoming':
          clearListContainer();
          loadLists(findUpcoming(addresses, 3));
          break;
      }
    }
    sortSelect.addEventListener('change', changeOption);
  });

  //адаптивное меню
  AdaptiveMenu();
})();
