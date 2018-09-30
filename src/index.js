import './sass/styles.scss';
import {
  getUserInfo,
  getUserFavourites,
  getUserCreated,
  createAddress,
  deleteAddress
} from './js/api/api';
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
// import { loadLists, clearListContainer } from './js/api/show-adr';
import { showMyAdresses, showFavorites, cleanSliders } from './js/slider';
import { handleModal, setModalListeners, hideForm } from './js/modal/modal';
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
  let sortButton = document.querySelector('.sort__button');
  let deleteModal = document.querySelector('.modal__delete');
  let deleteInput = document.getElementById('delete-input');
  let actionButtons = document.querySelectorAll('.action-buttons__button');
  let userData;
  let favoriteAddresses, myAddresses;

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

  function exitNaviBook() {
    loginLink.classList.remove('js-authorized');

    for (let i = 0; i < actionButtons.length; i++) {
      actionButtons[i].classList.add('action-buttons__button--disabled');
    }

    loginLink.textContent = 'Личный кабинет';
    //скрыть внутреннее меню для Личного кабинета
    const menuLinks = document.querySelectorAll('#js-navigation__list li');
    for (let i = 0; i < menuLinks.length - 1; i++) {
      menuLinks[i].classList.add('visually-hidden');
    }
    //Убрать со страницы список адресов
    // clearListContainer();
    cleanSliders();

    //показать приветственный текст
    const welcomeBlock = document.getElementById('js-welcomeBlock');
    welcomeBlock.classList.remove('visually-hidden');
  }

  loginLink.addEventListener('click', () => {
    if (loginLink.classList.contains('js-authorized')) {
      exitNaviBook();
    }
  });

  setModalListeners('.modal__search', '.search__button');
  setModalListeners('.modal__sort', '.sort__button');
  setModalListeners('.modal__delete', '.delete__button');

  let loginInfo = getLoginInfo();
  let newAddressInfo = getNewAddressInfo();

  function openNaviBook() {
    loginLink.textContent = 'Выход';
    loginLink.classList.add('js-authorized');

    //скрыть приветственный текст
    const welcomeBlock = document.getElementById('js-welcomeBlock');
    welcomeBlock.classList.add('visually-hidden');

    //отобразить внутреннее меню для Личного кабинета
    const menuLinks = document.querySelectorAll('#js-navigation__list li');
    for (let i = 0; i < menuLinks.length - 1; i++) {
      menuLinks[i].classList.remove('visually-hidden');
    }
  }

  loginForm.addEventListener('submit', () => {
    function getUserAddress(email, password) {
      loginLink.textContent = 'Загрузка данных ...';

      getUserInfo(email, password)
        .then(user => {
          userData = user;
          openNaviBook();
          hideForm(modalLoginWindow);

          return getUserFavourites(user);
        })
        .then(arr => {
          // loadLists(arr);
          favoriteAddresses = arr;
          showFavorites(favoriteAddresses);

          for (let i = 0; i < actionButtons.length; i++) {
            actionButtons[i].classList.remove(
              'action-buttons__button--disabled'
            );
          }
          return getUserCreated(userData);
        })
        .then(arr => {
          myAddresses = arr;
          showMyAdresses(myAddresses);
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
  // Еще один дубляж
  // searchButton.addEventListener('click', () => {
  //   //поиск по названию
  //   searchInput.addEventListener('keydown', function(evt) {
  //     if (evt.keyCode === ENTER_KEYCODE) {
  //       evt.preventDefault();
  //       // loadLists(findName(addresses, searchInput.value));
  //       showFavorites(findName(favoriteAddresses, searchInput.value));
  //       showMyAdresses(findName(myAddresses, searchInput.value));
  //     }
  //   });
  // });

  sortButton.addEventListener('click', () => {
    function changeOption() {
      let selectedOption = sortSelect.options[sortSelect.selectedIndex];
      switch (selectedOption.value) {
        case 'all':
          // clearListContainer();
          // loadLists(addresses);
          cleanSliders();
          showFavorites(favoriteAddresses);
          showMyAdresses(myAddresses);
          break;
        case 'alphabet':
          // clearListContainer();
          // loadLists(sortAbc(addresses));
          cleanSliders();
          showFavorites(sortAbc(favoriteAddresses));
          showMyAdresses(sortAbc(myAddresses));
          break;
        case 'addresses':
          // clearListContainer();
          // loadLists(findType(addresses, 'other'));
          cleanSliders();
          showFavorites(findType(favoriteAddresses, 'other'));
          showMyAdresses(findType(myAddresses, 'other'));
          break;
        case 'events':
          // clearListContainer();
          // loadLists(findType(addresses, 'event'));
          cleanSliders();
          showFavorites(findType(favoriteAddresses, 'event'));
          showMyAdresses(findType(myAddresses, 'event'));
          break;
        case 'date':
          // clearListContainer();
          // loadLists(sortByDate(addresses));
          cleanSliders();
          showFavorites(sortByDate(favoriteAddresses));
          showMyAdresses(sortByDate(myAddresses));
          break;
        case 'nearest':
          // clearListContainer();
          cleanSliders();
          getLocation()
            .then(coords => createRect(coords))
            .then(rect => {
              // loadLists(findNearest(addresses, rect));
              showFavorites(findNearest(favoriteAddresses, rect));
              showMyAdresses(findNearest(myAddresses, rect));
            });
          break;
        case 'upcoming':
          // clearListContainer();
          // loadLists(findUpcoming(addresses, 3));
          cleanSliders();
          showFavorites(findUpcoming(favoriteAddresses, 3));
          showMyAdresses(findUpcoming(myAddresses, 3));
          break;
      }
    }
    sortSelect.addEventListener('change', changeOption);
  });

  deleteInput.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      let addressesToDelete = findName(myAddresses, deleteInput.value);
      if (addressesToDelete.length > 0) {
        getUserInfo(loginInfo.email, loginInfo.password).then(user =>
          addressesToDelete.forEach(function(address) {
            deleteAddress(user.token, address.container, address.naviaddress);
            console.log('Удачно удален адрес: ' + address.name);
          })
        );
        hideForm(deleteModal);
      }
    }
  });

  searchInput.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      // clearListContainer();
      // loadLists(findName(addresses, searchInput.value));
      cleanSliders();
      showFavorites(findName(favoriteAddresses, searchInput.value));
      showMyAdresses(findName(myAddresses, searchInput.value));
    }
  });

  AdaptiveMenu();
})();
