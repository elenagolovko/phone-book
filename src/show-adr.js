export default function createList(arr) {
  const container = document.getElementById('list'); //контейнер для списка
  container.innerHTML = '';
  let oldArr = arr.slice();
  let latestArr = arr.splice(arr.length - 10);
  oldArr.forEach(function(i) {
    let address = document.createElement('li');
    address.setAttribute('class', 'my-notebook__address'); //контейнер для адреса
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
          .replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1') +
        ', ' +
        i.event_start.substr(11, 5);
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
