import './sass/styles.scss';

import adaptiveMenu from './js/menu/menu';
import pageSignIn from './js/pages/pageSignIn';

('use strict');

(function() {
  // Common for all pages
  adaptiveMenu();

  // "Sign-in" page
  pageSignIn();
})();
