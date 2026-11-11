export function showAPIerror(contentWrapper, retryFunction) {
  const tagName = contentWrapper.tagName === 'UL' ? 'li' : 'div';

  const errorContainer = document.createElement(tagName);
  errorContainer.classList.add('state-container');

  const errorIcon = document.createElement('img');
  errorIcon.classList.add('error-img');
  errorIcon.src = '/assets/icons/ban.svg';
  errorIcon.alt = '';

  const msgHeading = document.createElement('h2');
  msgHeading.classList.add('error-h2');
  msgHeading.textContent = 'Something went wrong!';

  const text = document.createElement('p');
  text.classList.add('error-text');
  text.textContent = 'Please try again.';

  const retryButton = document.createElement('button');
  retryButton.setAttribute('aria-label', 'Retry');
  retryButton.classList.add('retry-btn');
  retryButton.textContent = 'Retry';

  errorContainer.append(errorIcon, msgHeading, text, retryButton);
  contentWrapper.appendChild(errorContainer);

  function retry() {
    errorContainer.remove();

    if (typeof retryFunction !== 'function') {
      return;
    }

    retryFunction();
  }

  retryButton.addEventListener('click', retry);
}
