/*----- СОРТИРОВКА и ПОИСК --------*/

//по алфавиту
function sortAbc(arr) {
  return arr.sort(function(a, b) {
    return a.name > b.name ? 1 : -1;
  });
}

//поиск по типу (событие или адрес)
function findType(arr, type) {
  return type == 'event'
    ? arr.filter(n => 'event' == n.address_type)
    : arr.filter(n => 'event' !== n.address_type);
}

//поиск по названию/слову в названии
function findName(arr, str) {
  return arr.filter(n => {
    let words = n.name.toLowerCase().split(' ');
    for (let i of words) {
      let pattern = str.slice(0, -2);
      if (pattern.toLowerCase() == i.substr(0, pattern.length)) {
        return true;
      }
    }
  });
}

//сортировка событий по дате
function sortByDate(arr) {
  return arr.sort((a, b) => {
    let date1 = Date.parse(a.event_start.substr(0, 19));
    let date2 = Date.parse(b.event_start.substr(0, 19));
    return date1 > date2 ? 1 : -1;
  });
}

//поиск ближайших событий
function findUpcoming(arr, limit) {
  //limit - период поиска в днях (не включая сегодняшний день)
  return arr.filter(n => {
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
const DELTA = 0.02; //по моим рассчетам, это примерно 2км, т.е. адреса будут отбираться в зоне 2км

// Получить текущее расположение
function getLocation() {
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
function createRect(coords, delta) {
  return {
    lt_lat: coords.latitude - delta,
    lt_lng: coords.longitude - delta,
    rb_lat: coords.latitude + delta,
    rb_lng: coords.longitude + delta
  };
}

//поиск адресов в заданном квадрате
function findNearest(arr, coords) {
  return arr.filter(n => {
    return (
      n.point.lat > coords.lt_lat &&
      n.point.lat < coords.rb_lat &&
      n.point.lng > coords.lt_lng &&
      n.point.lng < coords.rb_lng
    );
  });
}

//Обобщающая функция
// async function getNearestAdr() {
//   let user = await getUserInfo(email, password);
//   let created = await getUserCreated(user);
//   let favourites = await getUserFavourites(user);
//   let all = created.concat(favourites);
//   let arr = findType(all, 'free');
//   let coords = await getLocation();
//   let rect = createRect(coords, DELTA);
//   console.log(findNearest(arr, rect));
// }
