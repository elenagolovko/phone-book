/*----- СОРТИРОВКА и ПОИСК --------*/

//по алфавиту
export function sortAbc(arr) {
  return arr.sort(function(a, b) {
    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
  });
}

//поиск по типу (событие или адрес)
export function findType(arr, type) {
  return type == 'event'
    ? arr.filter(n => 'event' == n.address_type)
    : arr.filter(n => 'event' !== n.address_type);
}

//поиск по названию/слову в названии
export function findName(arr, str) {
  return arr.filter(n => {
    if (!n.name) {
      return false;
    }
    let words = n.name.toLowerCase().split(' '); //делим название на массив из слов
    for (let i of words) {
      let pattern = str.length > 3 ? str.slice(0, -2) : str; //формируем паттерн для поиска (убираем у слова окончание, чтобы падеж и число не влияли на результат. Но если слово короткое, то оно, скорее всего, и так без окончания, так что его берем целиком)
      //фильтруем подходящие свлова без учета регистра
      if (pattern.toLowerCase() == i.substr(0, pattern.length)) {
        return true;
      }
    }
  });
}

//сортировка событий по дате
export function sortByDate(arr) {
  let events = findType(arr, 'event');
  return events.sort(function(a, b) {
    //переводим даты в timestamp и сравниваем
    let date1 = Date.parse(a.event_start.substr(0, 19));
    let date2 = Date.parse(b.event_start.substr(0, 19));
    return date1 > date2 ? 1 : -1;
  });
}

//поиск ближайших событий
export function findUpcoming(arr, limit) {
  //limit - период поиска в днях (не включая сегодняшний день)
  let events = findType(arr, 'event');
  return events.filter(n => {
    let date = Date.parse(n.event_start.substr(0, 19));
    let now = Date.parse(new Date());
    return date > now && date < now + 1000 * 60 * 60 * 24 * limit;
  });
}

//Пример использования (в моих избранных адресах есть такой адрес):
// getUserInfo(email, password)
// .then((user) => Promise.all([getUserCreated(user), getUserFavourites(user)])
// .then((res) => res[0].concat(res[1])))
// .then((arr) => findType(arr, 'event'))
// .then((arr) => console.log(findName(arr, 'природа')))

/* --- 
Поиск ближайших (по месторасположению) адресов 
----*/

// Получить текущее расположение
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords);
        resolve(position.coords);
      });
    } else {
      alert('Геолокация не поддерживается вашим браузером');
      reject();
    }
  });
}
// Создать квадрат для поиска вокруг адреса
export function createRect(coords) {
  const delta = 0.02; //по моим рассчетам, это примерно 2км, т.е. адреса будут отбираться в зоне 2км
  return {
    lt_lat: coords.latitude - delta,
    lt_lng: coords.longitude - delta,
    rb_lat: coords.latitude + delta,
    rb_lng: coords.longitude + delta
  };
}

//поиск адресов в заданном квадрате
export function findNearest(arr, coords) {
  return arr.filter(n => {
    return (
      n.point.lat > coords.lt_lat &&
      n.point.lat < coords.rb_lat &&
      n.point.lng > coords.lt_lng &&
      n.point.lng < coords.rb_lng
    );
  });
}

//Обобщающая функция, которая почему-то выдает ошибку
// async function getNearestAdr(arr) {
//   let coords = await getLocation();
//   let rect = createRect(coords, DELTA);
//   return findNearest(arr, rect);
// }
