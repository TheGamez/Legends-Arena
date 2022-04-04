/* VARIABLES */

const DEBUG = false;

/* FUNCTIONS */

const searchYoutubeEvent = async (searchTerm) => {
  if (searchTerm && searchTerm.length > 0) {

    const youtubeAPIKey = 'AIzaSyCmjMyRwDRyLkh0JTnoOz8pOr07N3VY-Tk';
    const youtubeURLPart = 'snippet';
    const youtubeURLQ = searchTerm;
    const youtubeMaxResults = 20;
    const youtubeURL = `https://youtube.googleapis.com/youtube/v3/search?part=${youtubeURLPart}&q=${youtubeURLQ}&maxResults=${youtubeMaxResults}&key=${youtubeAPIKey}`;

    try {
      const endpoint = youtubeURL;
      const options = { method: 'GET' };

      const response = await fetch(endpoint, options);
      const data = await response.json();
  
      if (DEBUG) console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export {
  searchYoutubeEvent,
}