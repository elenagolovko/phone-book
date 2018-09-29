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
import { showMyAdresses, showFavorites, cleanSlider } from './js/slider';
import { handleModal, setModal } from './modal';
import {
  validatePos,
  validateEmail,
  validatePassword,
  setErrorState,
  resetInputState
} from './validation';

('use strict');

(function() {
  let ENTER_KEYCODE = 13;
  let loginLink = document.querySelector('.link-login');
  let modalLoginWindow = document.querySelector('.modal-login');
  let loginForm = document.querySelector('.modal__login-form');
  let sortSelect = document.querySelector('.my-notebook__selection-parameters');
  let searchInput = document.getElementById('nav-search');
  let createForm = document.querySelector('.new-note__form');
  let searchButton = document.querySelector('.search__button');
  let sortButton = document.querySelector('.sort__button');
  let userData;
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

  setModal('.modal__search', '.search__button');
  setModal('.modal__sort', '.sort__button');

  function validatePassword(value, element) {
    if (value.length < 6 || value.length > 20) {
      setErrorState(element);
      return false;
    } else {
      resetInputState(element);
      return true;
    }
  }

  loginLink.addEventListener('click', event => {
    if (loginLink.classList.contains('js-authorized')) {
      loginLink.classList.remove('js-authorized');

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
      loginLink.textContent = 'Загрузка данных ...';

      getUserInfo(email, password)
        .then(user => {
          userData = user;

          loginLink.textContent = 'Выход';
          loginLink.classList.add('js-authorized');

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
          let actionButtons = document.querySelectorAll(
            '.action-buttons__button'
          );

          for (let i = 0; i < actionButtons.length; i++) {
            actionButtons[i].classList.remove(
              'action-buttons__button--disabled'
            );
          }
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

  //адаптивное меню
  AdaptiveMenu();
})();
