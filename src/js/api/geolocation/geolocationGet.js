function geolocationGet() {
  if (!navigator.geolocation) {
    console.log = 'Geolocation is not supported by your browser';
    return;
  }

  return new Promise(function(resolve, reject) {
    // Вывести сообщение о загрузке данных в месте загрузки геолокации
    console.log('Locating…');

    navigator.geolocation.getCurrentPosition(
      position => {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log('latitude', latitude);
        console.log('longitude', longitude);

        resolve(position.coords);
      },
      error => {
        let errMessage;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errMessage = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errMessage = 'The request to get user location timed out.';
            break;
          case error.UNKNOWN_ERROR:
            errMessage = 'An unknown error occurred.';
            break;
        }

        reject(errMessage);
      }
    );
  });
}

export default geolocationGet;
