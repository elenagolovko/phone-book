//функция, чтобы очищать list-container каждый раз, когда нужно отобразить новый список адресов
export function clearListContainer() {
  let listContainer = document.getElementById('list-container');
  listContainer.innerHTML = '';
}

//отображение адресов порциями максимум по 10шт
export function loadLists(arr) {
  let clone = arr.slice(0); //клон массива, чтобы настоящий массив не обрезался
  let i = 1;
  function loadList() {
    let id = 'list' + i;
    let newList = document.createElement('ul'); //создаем новый список со своим id, чтобы потом функция createList понимала, куда конкретно вставлять адреса
    newList.setAttribute('class', 'my-notebook__list');
    newList.setAttribute('id', id);
    let listContainer = document.getElementById('list-container');
    listContainer.appendChild(newList); //вставляем в контейнер для списков
    if (clone.length > 10) {
      //если адресов больше 10, создаем 1ый список из 1ых 10ти адресов
      createList(clone.splice(0, 10), id);
      let btn = document.createElement('a');
      btn.setAttribute('href', '#');
      btn.setAttribute('id', 'btn' + i);
      btn.setAttribute('class', 'my-notebook__expansion-btn');
      btn.innerHTML = 'show more';
      newList.appendChild(btn); //добавляем кнопку, которая будет раскрывать следующий блок и исчезать
      btn.addEventListener('click', e => {
        e.preventDefault();
        loadList(); //рекурсия запускает загрузку следующего блока
        btn.parentNode.removeChild(btn);
      });
      i++;
    } else {
      //если адесов меньше 10ти просто выводим их без кнопки
      createList(clone, id);
    }
  }
  load();
}
export function createList(arr, id) {
  const container = document.getElementById(id); //контейнер для списка
  container.innerHTML = '';
  // let latestArr = arr.splice(arr.length - 10);
  arr.forEach(function(i) {
    let address = document.createElement('li'); //контейнер для адреса
    address.setAttribute('class', 'my-notebook__address');
    container.appendChild(address);
    let name = document.createElement('h3'); //название
    name.innerHTML = i.name;
    address.appendChild(name);
    let naviadr = document.createElement('p'); //навиадрес
    naviadr.innerHTML = '[' + i.container + ']' + i.naviaddress;
    address.appendChild(naviadr);
    //описание
    if (i.description) {
      let description = document.createElement('p');
      description.innerHTML = i.description;
      address.appendChild(description);
    }
    let postalAdr = document.createElement('p'); //почтовый адрес
    postalAdr.innerHTML = i.postal_address;
    address.appendChild(postalAdr);
    //контакты
    if (i.contacts) {
      let contacts = document.createElement('p');
      for (let j of i.contacts) {
        let contact = document.createElement('p');
        contact.classList.add('contact');
        contact.innerHTML = j.value;
        contacts.appendChild(contact);
      }
      address.appendChild(contacts);
    }
    //время начала и окончания
    if (i.event_start) {
      let start = document.createElement('div');
      let end = document.createElement('div');
      start.innerHTML =
        'Начало: ' +
        i.event_start
          .substr(0, 10)
          .replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1') + //переводим дату с машинного в человеческий формат
        ', ' +
        i.event_start.substr(11, 5); //берем время в чч:мм
      address.appendChild(start);
      end.innerHTML =
        'Завершение: ' +
        i.event_end
          .substr(0, 10)
          .replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1') +
        ', ' +
        i.event_end.substr(11, 5);
      address.appendChild(end);
    }
  });
}
