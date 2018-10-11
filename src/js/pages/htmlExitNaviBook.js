import { cleanSliders } from '../slider';

function exitNaviBook() {
  let loginLink = document.querySelector('.link-login');
  let actionButtons = document.querySelectorAll('.action-buttons__button');

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
  cleanSliders();

  //показать приветственный текст
  const welcomeBlock = document.getElementById('js-welcomeBlock');
  welcomeBlock.classList.remove('visually-hidden');
}

export default exitNaviBook;
