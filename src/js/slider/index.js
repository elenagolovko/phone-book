import { getUserCreated, getUserFavourites } from '../../api';
import showSlider from './showSlider';

export const showMyAdresses = userData => {
  getUserCreated(userData).then(adresses => {
    showSlider(adresses, 'js-sliderMyAdresses', 'Мои адреса', 'adresses');
  });
};

export const showFavorites = userData => {
  getUserFavourites(userData).then(adresses => {
    showSlider(adresses, 'js-sliderFavorites', 'Избранное', 'favorites');
  });
};

export const cleanSlider = () => {
  //Убрать со страницы слайдер с адресами
  document.getElementById('js-slider').innerHTML = '';
};
