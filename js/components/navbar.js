// This is so the nav bar can appear on all pages

export function Navbar(activePage) {
  const nav = document.createElement('nav');
  nav.classList.add('navbar');

  nav.innerHTML = `
  <a class="header-logo" href="/">
          <img
            class="book-open-img"
            src="../../assets/images/book-open-text.svg"
            alt=""
          />
          <span class="my-lib">My Library</span>
        </a>
        <!-- Page Links -->
        <div class="pageLinks">
          <ul class="pages-container">
              <li>
                <a class="link-container ${activePage === 'home' ? 'active' : ''}"
                 href="/"
                ${activePage === 'home' ? 'aria-current="page"' : ''}
                aria-label='Home'
                >
                  <img class="page-img" src="../../assets/icons/house.svg" alt="" />
                  <span class="link-text">Home</span>
                </a>
              </li>
              <li>
                <a class="link-container ${activePage === 'my-books' ? 'active' : ''}"
                href="/pages/my-books.html"
                ${activePage === 'my-books' ? 'aria-current="page"' : ''}
                 aria-label='My Books'
                 >
                  <img
                    class="page-img"
                    src="../../assets/icons/bookmark.svg"
                    alt=""
                  />
                  <span class="link-text">My books</span>
                </a>
              </li>
              </ul>
        </div>
  `;

  return nav;
}
