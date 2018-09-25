// Эти данные нужно будет получать из форм
// export const email = 'ekaterina.dony@yandex.ru';
// export const password = '71115317';
let newLat = 55.775277;
let newLng = 37.819246;
let name = 'Старт';
let description = 'Начало маршрута для пробежки 10км';

//Получение токена и user-id (id нужен для получения адресов юзера, а токен - вообще для всего)
export function getUserInfo(email, password) {
  console.log(email, password);
  return new Promise(function(resolve) {
    fetch('https://staging-api.naviaddress.com/api/v1.5/sessions', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        password: password,
        type: 'email',
        email: email
      })
    })
      .then(response => response.json())
      .then(data => {
        let user = {
          id: data.id,
          token: data.token
        };
        console.log(user);
        resolve(user);
      })
      .catch(function(error) {
        console.log('Request failed', error);
      });
  });
}

//Создание адреса
function createAddress(user) {
  let token = user.token;
  fetch('https://staging-api.naviaddress.com/api/v1.5/addresses', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'auth-token': token
    },
    body: JSON.stringify({
      lat: newLat,
      lng: newLng,
      address_type: 'free',
      default_lang: 'ru'
    })
  })
    .then(response => response.json())
    .then(data => {
      /*Получаем номер контейнера и адрес и передаем данные дальше, для подтверждения адреса*/
      let container = data.result.container;
      let naviaddress = data.result.naviaddress;
      acceptAddress(token, container, naviaddress);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

function acceptAddress(token, container, naviaddress) {
  fetch(
    'https://staging-api.naviaddress.com/api/v1.5/addresses/accept/' +
      container +
      '/' +
      naviaddress,
    {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        container: container,
        naviaddress: naviaddress
      })
    }
  )
    .then(() => {
      addInfo(token, container, naviaddress, name, description);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

function addInfo(token, container, naviaddress, name, description) {
  fetch(
    ' https://staging-api.naviaddress.com/api/v1.5/addresses/' +
      container +
      '/' +
      naviaddress,
    {
      method: 'put',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        lang: 'ru',
        name: name,
        description: description,
        map_visibility: 'true'
      })
      /*В body может быть много параметром, обязательные - это lang и name, остальные я просто для примера добавила.
Надо еще доработать, чтоб функция могла любую инфу, которую юзер заполнил, добавлять*/
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log(
        data
      ); /*информацию о получившемся адресе можно посмотреть в консоли, чисто для нас, для проверки*/
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

//Получения избранных адресов
function getUserFavourites(user) {
	return new Promise (function(resolve) {
	fetch('https://staging-api.naviaddress.com/api/v1.5/Addresses/favorites?UserId=' + user.id, {  
	method: 'get',  
	headers: {  
						"content-type": "application/json",  
						"auth-token": user.token  
					}, 
})
.then(response => response.json())  
.then(data => {
		console.log('Избранные:', data.result); /*пока только в консоль выводит*/
		resolve(data.result);
	}) 
.catch(function (error) {  
	console.log('Request failed', error);  
});
});
}

//Получение адресов, созданных юзером
function getUserCreated(user) {
	return new Promise (function(resolve) {
	fetch('https://staging-api.naviaddress.com/api/v1.5/Addresses/my?UserId=' + user.id, {  
	method: 'get',  
	headers: {  
						"content-type": "application/json",  
						"auth-token": user.token  
					}, 
})
.then(response => response.json())  
.then(data => {
		console.log('Созданные:', data.result);
		resolve(data.result);
	}) 
.catch(function (error) {  
	console.log('Request failed', error);  
});
});
}

/*----
Чтобы создать новый адрес, запускаем:
getUserInfo(email, password).then((user) => createAddress(user));

Чтобы получить избранные адреса:
getUserInfo(email, password).then((user) => getUserFavourites(user));

Чтобы получить созданные:
getUserInfo(email, password).then((user) => getUserCreated(user));

Так можно внести изменения в уже существующий адрес. Соответственно переменные тоже должны откуда-то браться, а пока произвольно задаются
let container = 7;
let naviaddress = 703337;
let newDescription = 'Хорошее начало маршрута для пробежки 10км, но не в такую погоду';

getUserInfo(email, password).then((user) => addInfo(user.token, container, naviaddress, name, newDescription));
----*/

function deleteAddress(token, container, naviaddress) {
  fetch(
    'https://staging-api.naviaddress.com/api/v1.5/Addresses/' +
      container +
      '/' +
      naviaddress,
    {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        'auth-token': token
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}

//Все адреса(избранные + созданные)
// getUserInfo(email, password)
// .then((user) => Promise.all([getUserCreated(user), getUserFavourites(user)])
// .then((res) => res[0].concat(res[1])))

/*----- СОРТИРОВКА и ПОИСК --------*/

//по алфавиту
function sortAbc(arr) {
	return arr.sort(function (a, b) {
		return a.name > b.name ? 1 : -1;
	});
}

//поиск по типу (событие или адрес)
function findType(arr, type) {
	return type == 'event' ? 
	arr.filter( n => 'event' == n.address_type) : arr.filter( n => 'event' !== n.address_type);
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
function findUpcoming(arr, limit) { //limit - период поиска в днях (не включая сегодняшний день)
	return arr.filter(n => {
	let date = Date.parse(n.event_start.substr(0, 19));
	let now = Date.parse(new Date());
	return date > now && date < now + 1000*60*60*24*(limit);
	});
}

//Пример использования (в моих избранных адресах есть такой адрес):
// getUserInfo(email, password)
// .then((user) => Promise.all([getUserCreated(user), getUserFavourites(user)])
// .then((res) => res[0].concat(res[1])))
// .then((arr) => findType(arr, 'event'))
// .then((arr) => console.log(findName(arr, 'природа')));
