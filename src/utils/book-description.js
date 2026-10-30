export function displayBookDescription(description, descVariable) {
  // Check if the description is a string
  let descriptionText = '';
  if (typeof description === 'string') {
    descriptionText = description;
  }
  // Check if the description is an object
  else if (typeof description === 'object' && description !== null) {
    descriptionText = description.value;
  }

  // If there's no description available
  if (!descriptionText) {
    descVariable.textContent = 'No description available';
  }

  // Shorten descriptions to 250 letters, ending at a full stop
  if (descriptionText.length > 300) {
    const shortenedText = descriptionText.slice(0, 300);
    const lastFullStop = shortenedText.lastIndexOf('.');
    descVariable.textContent =
      lastFullStop !== -1
        ? shortenedText.slice(0, lastFullStop + 1)
        : `${shortenedText}...`;
  } else {
    descVariable.textContent = descriptionText;
  }
}
