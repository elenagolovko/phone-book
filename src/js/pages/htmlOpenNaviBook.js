import { hideForm } from '../modal/modal';

function openNaviBook() {
  let loginLink = document.querySelector('.link-login');
  let modalLoginWindow = document.querySelector('.modal-login');

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

  hideForm(modalLoginWindow);
}

export default openNaviBook;
