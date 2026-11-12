import { createSkeleton } from 'https://esm.sh/@theengineeringmind/auto-skeleton@0.1.1';

export function displaySkeleton() {
  const bookOfDay = document.querySelector('.book-o-t-d');
  const trendingContainer = document.querySelector('.trending-container');
  const genres = document.querySelector('.genre-tag-container');

  const colors = {
    color: '#e5e0da',
    highlight: '#f5f3f0',
  };

  //  skeletons
  const bookOfDaySkeleton = createSkeleton(bookOfDay, colors);

  createTrendingPlaceholders();
  const trendingSkeleton = createSkeleton(trendingContainer, colors);
  
  trendingContainer.querySelector('.trending-books-container').innerHTML = '';

  const genresSkeleton = createSkeleton(genres, colors);

  bookOfDay.replaceWith(bookOfDaySkeleton.element);
  trendingContainer.replaceWith(trendingSkeleton.element);
  genres.replaceWith(genresSkeleton.element);

  return {
    originalElements: {
      bookOfDay,
      trendingContainer,
      genres,
    },

    skeletons: {
      bookOfDaySkeleton,
      trendingSkeleton,
      genresSkeleton,
    },
  };
}

export function hideSkeleton(skeletonData) {
  const { originalElements, skeletons } = skeletonData;

  skeletons.bookOfDaySkeleton.element.replaceWith(originalElements.bookOfDay);

  skeletons.trendingSkeleton.element.replaceWith(
    originalElements.trendingContainer,
  );

  skeletons.genresSkeleton.element.replaceWith(originalElements.genres);
}

function createTrendingPlaceholders() {
  const trendingBooks = document.querySelector('.trending-books-container');

  for (let i = 0; i < 8; i++) {
    const li = document.createElement('li');
    li.classList.add('trending-book-card');

    const img = document.createElement('div');
    img.classList.add('skeleton-book-cover');
    img.dataset.autoSkeleton = 'block';

    const title = document.createElement('div');
    title.classList.add('skeleton-book-title');
    title.dataset.autoSkeleton = 'block';

    li.append(img, title);
    trendingBooks.appendChild(li);
  }
}
