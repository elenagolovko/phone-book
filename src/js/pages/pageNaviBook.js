import {
  sessionCreate,
  geolocationGet,
  naviCreate,
  naviDelete
} from '../api/index';
import {
  sortByDate,
  sortAbc,
  createRect,
  findNearest,
  findUpcoming,
  findType,
  findName
} from '../sort/sort';
import { showMyAdresses, showFavorites, cleanSliders } from '../slider';
import { handleModal, setModalListeners, hideForm } from '../modal/modal';
import { validatePos } from '../modal/validation';
import exitNaviBook from './htmlExitNaviBook';
import getUserAddress from './getUserAddress';

function pageNaviBook(loginInfo, arrAddresses) {
  let loginLink = document.querySelector('.link-login');

  loginLink.addEventListener('click', () => {
    if (loginLink.classList.contains('js-authorized')) {
      exitNaviBook();
    }
  });

  setModalListeners('.modal__search', '.search__button');
  setModalListeners('.modal__sort', '.sort__button');
  setModalListeners('.modal__delete', '.delete__button');

  let createForm = document.querySelector('.new-note__form');
  let modalCreateWindow = document.querySelector('.modal__new-note');
  let newAddressInfo = handleModal('.modal__new-note', '.create__button', {
    validatePos
  });

  createForm.addEventListener('submit', () => {
    if (!newAddressInfo.validity) {
      console.log('createForm: validity error', newAddressInfo);
    }

    hideForm(modalCreateWindow);

    // TODO: Добавить дизайн "ожидание загрузки"
    console.log('загрузка...');

    sessionCreate(loginInfo.email, loginInfo.password).then(user => {
      naviCreate(
        user,
        newAddressInfo.newLat,
        newAddressInfo.newLng,
        newAddressInfo.name,
        newAddressInfo.description
      ).then(() => {
        getUserAddress(loginInfo.email, loginInfo.password).then(data => {
          arrAddresses = data;
          cleanSliders();
          showFavorites(data[0]);
          showMyAdresses(data[1]);
        });
      });
    });
  });

  let sortButton = document.querySelector('.sort__button');
  let sortSelect = document.querySelector('.my-notebook__selection-parameters');

  sortButton.addEventListener('click', () => {
    function changeOption() {
      let selectedOption = sortSelect.options[sortSelect.selectedIndex];
      switch (selectedOption.value) {
        case 'all':
          cleanSliders();
          showFavorites(arrAddresses[0]);
          showMyAdresses(arrAddresses[1]);
          break;
        case 'alphabet':
          cleanSliders();
          showFavorites(sortAbc(arrAddresses[0]));
          showMyAdresses(sortAbc(arrAddresses[1]));
          break;
        case 'addresses':
          cleanSliders();
          showFavorites(findType(arrAddresses[0], 'other'));
          showMyAdresses(findType(arrAddresses[1], 'other'));
          break;
        case 'events':
          cleanSliders();
          showFavorites(findType(arrAddresses[0], 'event'));
          showMyAdresses(findType(arrAddresses[1], 'event'));
          break;
        case 'date':
          cleanSliders();
          showFavorites(sortByDate(arrAddresses[0]));
          showMyAdresses(sortByDate(arrAddresses[1]));
          break;
        case 'nearest':
          cleanSliders();
          geolocationGet()
            .then(coords => createRect(coords))
            .then(rect => {
              showFavorites(findNearest(arrAddresses[0], rect));
              showMyAdresses(findNearest(arrAddresses[1], rect));
            });
          break;
        case 'upcoming':
          cleanSliders();
          showFavorites(findUpcoming(arrAddresses[0], 3));
          showMyAdresses(findUpcoming(arrAddresses[1], 3));
          break;
      }
    }

    sortSelect.addEventListener('change', changeOption);
  });

  let deleteInput = document.getElementById('delete-input');
  let deleteModal = document.querySelector('.modal__delete');
  let ENTER_KEYCODE = 13;

  deleteInput.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();

      let addressesToDelete = findName(arrAddresses[1], deleteInput.value);

      if (addressesToDelete.length > 0) {
        let modalConfirmation = document.querySelector(
          '.modal__delete-confirmation'
        );
        let deleteList = document.getElementById('addressesToDelete');
        let addressesNames = [];

        addressesToDelete.forEach(function(address) {
          addressesNames.push(
            '[' +
              address.container +
              ']' +
              address.naviaddress +
              ' ' +
              address.name
          );
        });

        deleteList.textContent = addressesNames;
        modalConfirmation.classList.remove('visually-hidden');
        let cancelDelete = modalConfirmation.querySelector('.cancel-delete');
        let confirmDelete = modalConfirmation.querySelector('.confirm-delete');

        cancelDelete.addEventListener('click', () => {
          modalConfirmation.classList.add('visually-hidden');
          return;
        });

        confirmDelete.addEventListener('click', () => {
          sessionCreate(loginInfo.email, loginInfo.password).then(user => {
            addressesToDelete.forEach(function(address) {
              naviDelete(
                user.token,
                address.container,
                address.naviaddress
              ).then(() => {
                getUserAddress(loginInfo.email, loginInfo.password).then(
                  data => {
                    arrAddresses = data;
                    cleanSliders();
                    showFavorites(data[0]);
                    showMyAdresses(data[1]);
                  }
                );
              });
            });
            //очистить массив с удаляемыми адресами
            addressesToDelete.length = 0;
          });

          modalConfirmation.classList.add('visually-hidden');
          deleteModal.classList.add('visually-hidden');
        });
      }
    }
  });

  let searchInput = document.getElementById('nav-search');

  searchInput.addEventListener('keydown', function(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();

      cleanSliders();
      showFavorites(findName(arrAddresses[0], searchInput.value));
      showMyAdresses(findName(arrAddresses[1], searchInput.value));
    }
  });
}

export default pageNaviBook;
