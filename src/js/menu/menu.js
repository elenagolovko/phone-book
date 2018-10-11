const MenuBtn = () => {
  const btnMenu = document.getElementById('js-navigation__btn');

  if (btnMenu.clientHeight > 0) {
    const menuLinks = document.getElementById('js-navigation__list');

    btnMenu.classList.toggle('navigation__btn-close');
    menuLinks.classList.toggle('navigation__list-mobile');
  }
};

export default function adaptiveMenu() {
  const arr_menuLink = document.getElementsByClassName('navigation__link');

  for (let i = 0; i < arr_menuLink.length; i++) {
    arr_menuLink[i].addEventListener('click', MenuBtn);
  }

  document
    .getElementById('js-navigation__btn')
    .addEventListener('click', MenuBtn);
}
