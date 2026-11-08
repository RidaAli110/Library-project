// NavBar 
export function Navbar(activePage) {
  const nav = document.createElement('nav');
  nav.classList.add('navbar');

  nav.innerHTML = `
  <a class="header-logo" href="/index.html">
          <img
            class="book-open-img"
            src="/assets/images/book-open-text.svg"
            alt=""
          />
          <span class="my-lib">no name</span>
        </a>
        <!-- Page Links -->
        <div class="pageLinks">
          <ul class="pages-container">
              <li>
                <a class="link-container ${activePage === 'home' ? 'active' : ''}"
                 href="/index.html"
                ${activePage === 'home' ? 'aria-current="page"' : ''}
                aria-label='Home'
                >
                  <img class="page-img" src="/assets/icons/house.svg" alt="" />
                  <span class="link-text">Home</span>
                </a>
              </li>
              <li>
                <a class="link-container ${activePage === 'my-library' ? 'active' : ''}"
                href="/src/pages/my-library.html"
                ${activePage === 'my-library' ? 'aria-current="page"' : ''}
                 aria-label='My library'
                 >
                  <img
                    class="page-img"
                    src="/assets/icons/bookmark.svg"
                    alt=""
                  />
                  <span class="link-text">My Library</span>
                </a>
              </li>
              </ul>
        </div>
  `;

  return nav;
}
