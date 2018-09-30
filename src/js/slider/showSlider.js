const showSlider = (adresses, idHtml, sliderName, type) => {
  const sliderWidth = 230;
  let numSliders = parseInt(window.innerWidth / sliderWidth);
  if (adresses.length < numSliders) {
    numSliders = adresses.length;
  }

  const containerUl = document.createElement('ul');
  containerUl.setAttribute('class', 'slider');

  for (let i = 0; i < numSliders; i++) {
    const containerLi = document.createElement('li');
    containerLi.setAttribute('class', 'slider__adress');
    containerUl.appendChild(containerLi);

    const name = document.createElement('h3');
    name.setAttribute('class', 'slider__name');
    name.innerHTML = adresses[i].name;
    containerLi.appendChild(name);

    const naviAdress = document.createElement('p');
    naviAdress.setAttribute('class', 'slider__navi-adress');
    naviAdress.innerHTML =
      '[' + adresses[i].container + '] ' + adresses[i].naviaddress;
    containerLi.appendChild(naviAdress);

    // const point = document.createElement('p');
    // point.setAttribute('class', 'slider__point');
    // point.innerHTML =
    //   'Местоположение: ' + adresses[i].point.lat + ', ' + adresses[i].point.lng;
    // containerLi.appendChild(point);

    if (adresses[i].postal_address) {
      const postalAdr = document.createElement('p'); //почтовый адрес
      postalAdr.setAttribute('class', 'slider__postal_address');
      postalAdr.innerHTML = adresses[i].postal_address;
      containerLi.appendChild(postalAdr);
    }

    // if (adresses[i].description) {
    //   const description = document.createElement('p');
    //   description.setAttribute('class', 'slider__description');
    //   description.innerHTML = adresses[i].description;
    //   containerLi.appendChild(description);
    // }

    if (adresses[i].event_start) {
      const start = document.createElement('div');
      start.setAttribute('class', 'slider__date');
      const end = document.createElement('div');
      end.setAttribute('class', 'slider__date');
      const dateStart = new Date(adresses[i].event_start);
      const dateEnd = new Date(adresses[i].event_end);
      var dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
      };
      start.innerHTML = 'С: ' + dateStart.toLocaleString('ru', dateOptions);
      containerLi.appendChild(start);
      end.innerHTML = 'По: ' + dateEnd.toLocaleString('ru', dateOptions);
      containerLi.appendChild(end);
    }
  }

  const title = document.createElement('h3');
  title.setAttribute('class', 'slider__title');
  title.textContent = sliderName + ': ' + adresses.length;

  const slider = document.getElementById(idHtml);
  slider.innerHTML = '';
  slider.appendChild(title);
  slider.appendChild(containerUl);

  if (adresses.length > 0) {
    const buttonLeft = document.createElement('button');
    buttonLeft.setAttribute(
      'class',
      'slider__control control__left ' + 'js-' + type
    );
    buttonLeft.textContent = '<';

    const buttonRight = document.createElement('button');
    buttonRight.setAttribute(
      'class',
      'slider__control control__right ' + 'js-' + type
    );
    buttonRight.textContent = '>';

    slider.appendChild(buttonLeft);
    slider.appendChild(buttonRight);

    const leftBtn = document.querySelector('.control__left.js-' + type);
    const rightBtn = document.querySelector('.control__right.js-' + type);

    leftBtn.addEventListener('click', () => {
      const temp = adresses.pop();
      adresses.unshift(temp);

      showSlider(adresses, idHtml, sliderName, type);
    });
    rightBtn.addEventListener('click', () => {
      const temp = adresses.shift();
      adresses.push(temp);

      showSlider(adresses, idHtml, sliderName, type);
    });
  }
};

export default showSlider;
