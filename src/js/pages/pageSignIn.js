import { handleModal } from '../modal/modal';
import { validateEmail, validatePassword } from '../modal/validation';
import getUserAddress from './getUserAddress';
import pageNaviBook from './pageNaviBook';

function pageSignIn() {
  const loginForm = document.querySelector('.modal__login-form');
  const loginInfo = handleModal('.modal-login', '.link-login', {
    validateEmail,
    validatePassword
  });

  loginForm.addEventListener('submit', () => {
    if (!loginInfo.validity) {
      return;
    }

    getUserAddress(loginInfo.email, loginInfo.password).then(arrAddresses => {
      // "Записная книжка" page
      pageNaviBook(loginInfo, arrAddresses);
    });
  });
}

export default pageSignIn;
