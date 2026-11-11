export function showLoading(contentWrapper, message) {
  const tagName = contentWrapper.tagName === 'UL' ? 'li' : 'div';

  const loadingContainer = document.createElement(tagName);
  loadingContainer.classList.add('state-container');
  loadingContainer.setAttribute('role', 'status');

  const spinner = document.createElement('span');
  spinner.classList.add('spinner');
  spinner.setAttribute('aria-hidden', 'true');

  const msgText = document.createElement('h1');
  msgText.classList.add('loading-msg');
  msgText.textContent = message;

  loadingContainer.append(msgText, spinner);
  contentWrapper.appendChild(loadingContainer);
}

export function hideLoading(contentWrapper) {
  const loadingContainer = contentWrapper.querySelector('.state-container');

  if (!loadingContainer) {
    return;
  }

  loadingContainer.remove();
}
