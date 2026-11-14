// NavBar
export function Navbar(activePage) {
  const nav = document.createElement('nav');
  nav.classList.add('navbar');

  // Website logo
  const logo = document.createElement('a');
  logo.classList.add('header-logo');
  logo.href = '/index.html';

  const logoImg = document.createElement('img');
  logoImg.classList.add('book-open-img');
  logoImg.src = '/assets/images/book-open-text.svg';
  logoImg.alt = '';

  const logoText = document.createElement('span');
  logoText.classList.add('logo-title');
  logoText.textContent = 'Book Discovery';

  logo.append(logoImg, logoText);

  // Page links
  const pageLinks = document.createElement('div');
  pageLinks.classList.add('pageLinks');

  const pagesContainer = document.createElement('ul');
  pagesContainer.classList.add('pages-container');

  // Home dashboard page
  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.classList.add('link-container');
  homeLink.href = '/index.html';
  homeLink.setAttribute('aria-label', 'Home');

  const homeImg = document.createElement('img');
  homeImg.classList.add('page-img');
  homeImg.src = '/assets/icons/house.svg';
  homeImg.alt = '';

  const homeText = document.createElement('span');
  homeText.classList.add('link-text');
  homeText.textContent = 'Home';

  if (activePage === 'home') {
    homeLink.classList.add('active');
    homeLink.setAttribute('aria-current', 'page');
  }
  homeLink.append(homeImg, homeText);
  homeLi.append(homeLink);

  // My library page
  const libraryLi = document.createElement('li');
  const libraryLink = document.createElement('a');
  libraryLink.classList.add('link-container');
  libraryLink.href = '/src/pages/my-library.html';
  libraryLink.setAttribute('aria-label', 'My library');

  const libraryImg = document.createElement('img');
  libraryImg.classList.add('page-img');
  libraryImg.src = '/assets/icons/bookmark.svg';
  libraryImg.alt = '';

  const libraryText = document.createElement('span');
  libraryText.classList.add('link-text');
  libraryText.textContent = 'My Library';

  if (activePage === 'my-library') {
    libraryLink.classList.add('active');
    libraryLink.setAttribute('aria-current', 'page');
  }

  libraryLink.append(libraryImg, libraryText);
  libraryLi.append(libraryLink);

  pagesContainer.append(homeLi, libraryLi);
  pageLinks.append(pagesContainer);
  nav.append(logo, pageLinks);

  return nav;
}
