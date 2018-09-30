import showSlider from './showSlider';

export const showMyAdresses = adresses => {
  const idHtml = 'js-sliderMyAdresses';
  const slider = document.createElement('div');
  slider.setAttribute('class', 'slider__container');
  slider.setAttribute('id', idHtml);
  document.getElementById('js-sliders').appendChild(slider);

  showSlider(adresses, idHtml, 'Мои адреса', 'adresses');
};

export const showFavorites = adresses => {
  const idHtml = 'js-sliderFavorites';
  const slider = document.createElement('div');
  slider.setAttribute('class', 'slider__container');
  slider.setAttribute('id', idHtml);
  document.getElementById('js-sliders').appendChild(slider);

  showSlider(adresses, idHtml, 'Избранное', 'favorites');
};

export const cleanSliders = () => {
  //Убрать со страницы слайдеры с адресами
  document.getElementById('js-sliders').innerHTML = '';
};
