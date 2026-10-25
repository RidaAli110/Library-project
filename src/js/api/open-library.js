'use strict';
const URL = 'https://openlibrary.org';

export async function getTrendingBooks() {
  try {
    const res = await fetch(`${URL}/trending/weekly.json?limit=16`)

    if(!res.ok) {
      throw new Error('failed to fetch')
    }

    const data = await res.json();
    return data.works ;
  } catch (error) {
    console.log(error);
  }
}



