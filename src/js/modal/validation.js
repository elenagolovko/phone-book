export function resetInputState(element) {
  if (element.classList.contains('modal__input--invalid')) {
    element.classList.remove('modal__input--invalid');
    let errorMessage;
    if (element.nextElementSibling.classList.contains('modal__error-message')) {
      errorMessage = element.nextElementSibling;
      errorMessage.classList.add('visually-hidden');
    }
    if (
      element.classList.contains('login-input') &&
      errorMessage.nextElementSibling.classList.contains('modal__error-message')
    ) {
      errorMessage.nextElementSibling.classList.add('visually-hidden');
    }
  }
}

export function setErrorState(element) {
  element.nextElementSibling.classList.remove('visually-hidden');
  element.classList.add('modal__input--invalid');
}

export function validatePos(value, element) {
  if (/\d+\.\d/gm.test(value)) {
    resetInputState(element);
    return true;
  } else {
    setErrorState(element);
    return false;
  }
}

export function validateEmail(value, element) {
  if (/@{1}/i.test(value)) {
    resetInputState(element);
    return true;
  } else {
    setErrorState(element);
    return false;
  }
}

export function validatePassword(value, element) {
  if (value.length < 6 || value.lenth > 20) {
    setErrorState(element);
    return false;
  } else {
    resetInputState(element);
    return true;
  }
}
