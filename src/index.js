import './sass/styles.scss';
import { getUserInfo, getUserFavourites, createAddress } from './js/api/api';
import {
  sortByDate,
  sortAbc,
  getLocation,
  createRect,
  findNearest,
  findUpcoming,
  findType,
  findName
} from './js/api/sort';
import AdaptiveMenu from './js/menu/menu';
import { loadLists, clearListContainer } from './js/api/show-adr';
import { showMyAdresses, showFavorites, cleanSlider } from './js/slider';
import { handleModal, setModal, hideForm } from './js/modal/modal';
import {
  validatePos,
  validateEmail,
  validatePassword
} from './js/modal/validation';

('use strict');

(function() {
  let ENTER_KEYCODE = 13;
  let loginLink = document.querySelector('.link-login');
  let modalLoginWindow = document.querySelector('.modal-login');
  let loginForm = document.querySelector('.modal__login-form');
  let sortSelect = document.querySelector('.my-notebook__selection-parameters');
  let searchInput = document.getElementById('nav-search');
  let modalCreateWindow = document.querySelector('.modal__new-note');
  let createForm = document.querySelector('.new-note__form');
  let searchButton = document.querySelector('.search__button');
  let sortButton = document.querySelector('.sort__button');
  let actionButtons = document.querySelectorAll('.action-buttons__button');
  let userData;
  let addresses;

  function switchButtonState() {
    let actionButtons = document.querySelectorAll('.action-buttons__button');

    for (let i = 0; i < actionButtons.length; i++) {
      actionButtons[i].classList.remove('action-buttons__button--disabled');
    }
  }

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

  setModal('.modal__search', '.search__button');
  setModal('.modal__sort', '.sort__button');

  loginLink.addEventListener('click', event => {
    if (loginLink.classList.contains('js-authorized')) {
      loginLink.classList.remove('js-authorized');

      for (let i = 0; i < actionButtons.length; i++) {
        actionButtons[i].classList.add('action-buttons__button--disabled');
      }

      loginLink.textContent = 'Личный кабинет';
      //Удалить меню для личного кабинета
      const menuLinks = document.querySelectorAll('#js-navigation__list li');
      for (let i = 0; i < menuLinks.length - 1; i++) {
        menuLinks[i].classList.add('visually-hidden');
      }
      //Убрать со страницы список адресов
      clearListContainer();
      cleanSlider();

      //показать приветственный текст
      const welcomeBlock = document.getElementById('js-welcomeBlock');
      welcomeBlock.classList.remove('visually-hidden');
    } else {
      // -------- ?????????  на что это заменилось ????? -----------
      // showLoginForm(event);
    }
  });

  let loginInfo = getLoginInfo();
  let newAddressInfo = getNewAddressInfo();

  loginForm.addEventListener('submit', () => {
    function getUserAddress(email, password) {
      loginLink.textContent = 'Загрузка данных ...';

      getUserInfo(email, password)
        .then(user => {
          userData = user;

          loginLink.textContent = 'Выход';
          loginLink.classList.add('js-authorized');

          hideForm(modalLoginWindow);

          //скрыть приветственный текст
          const welcomeBlock = document.getElementById('js-welcomeBlock');
          welcomeBlock.classList.add('visually-hidden');

          const menuLinks = document.querySelectorAll(
            '#js-navigation__list li'
          );
          for (let i = 0; i < menuLinks.length - 1; i++) {
            menuLinks[i].classList.remove('visually-hidden');
          }

          return getUserFavourites(user);
        })
        .then(arr => {
          loadLists(arr);
          addresses = arr;

          showFavorites(userData);
          showMyAdresses(userData);
          for (let i = 0; i < actionButtons.length; i++) {
            actionButtons[i].classList.remove(
              'action-buttons__button--disabled'
            );
          }
        });
    }

    getLoginInfo();

    if (!loginInfo.validity) {
      return;
    }
    getUserAddress(loginInfo.email, loginInfo.password);
  });

  createForm.addEventListener('submit', () => {
    getNewAddressInfo();

    getUserInfo(loginInfo.email, loginInfo.password)
      .then(user =>
        createAddress(
          user,
          newAddressInfo.newLat,
          newAddressInfo.newLng,
          newAddressInfo.name,
          newAddressInfo.description
        )
      )
      .then(() => {
        if (newAddressInfo.validity) {
          hideForm(modalCreateWindow);
        }
      });
    console.log('newAddressInfo: ', newAddressInfo);
  });

  searchButton.addEventListener('click', () => {
    //поиск по названию
    searchInput.addEventListener('keydown', function(evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        evt.preventDefault();
        loadLists(findName(addresses, searchInput.value));
      }
    });
  });

  sortButton.addEventListener('click', () => {
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

  searchInput.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      clearListContainer();
      loadLists(findName(addresses, searchInput.value));
    }
  });

  AdaptiveMenu();
})();
