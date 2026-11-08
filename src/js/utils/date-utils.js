/*-----Get publication year. Code from chatGPT----- */
export function getPublishYear(date) {
  if (!date) return Infinity;
  const year = date.match(/\b\d{4}\b/);

  return year ? Number(year[0]) : Infinity;
}

/*---------------------------------Format date---------------------------------*/
// Code from chatGPT
export function formatPublishDate(dateString) {
  if (!dateString) return 'Not available';

  // Keep year-only dates
  if (/^\d{4}$/.test(dateString.trim())) {
    return dateString.trim();
  }

  // Convert the date string into a JavaScript Date object
  const date = new Date(dateString);

  // Check whether JavaScript could understand the date
  // If it couldn't, return the original value instead of displaying an invalid date
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  // Format the date into british conventions
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
  }).format(date);
}