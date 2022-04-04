/* MODULES */

import GLOBAL_STATE from '../global';

/* VARIABLES */

const DEBUG = true;

/* FUNCTIONS */

const searchYoutubeEvent = async (searchTerm) => {
  if (searchTerm && searchTerm.length > 0) {

    const youtubeAPIKey = 'AIzaSyCmjMyRwDRyLkh0JTnoOz8pOr07N3VY-Tk';

    const youtubeURLPart = 'snippet';
    const youtubeURLQ = searchTerm;
    const youtubeMaxResults = 10;
    const youtubeOrder = 'viewCount';

    const youtubeURL = `https://youtube.googleapis.com/youtube/v3/search?part=${youtubeURLPart}&q=${youtubeURLQ}&order=${youtubeOrder}&maxResults=${youtubeMaxResults}&key=${youtubeAPIKey}`;

    try {
      const endpoint = youtubeURL;
      const options = {
        method: 'GET',
      }
  
      const response = await fetch(endpoint, options);
      const data = await response.json();
  
      if (DEBUG) console.log(data);

      GLOBAL_STATE.youtubeSearchResults = data;
    } catch (error) {
      console.log(error);
    }
  }
}

export {
  searchYoutubeEvent,
}