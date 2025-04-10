const fetch = require('node-fetch');

// Ask user a question and return input as Promise.
function ask(rl, question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

async function safeFetch(url, type = 'json') {
    try {
        // sends HTTP request to URL
        const response = await fetch(url);
  
        // status code other than 200, display a warning
        if (response.status !== 200) {
            console.log(`Warning: status code ${response.status} when accessing ${url}`);
            return null;
        }
  
        // return the type requested
        if (type === 'json') {
            return await response.json();
        } else if (type === 'text') {
            return await response.text();
        } else {
            // an unknown type
            console.log(`Unknown fetch type: ${type}`);
            return null;
        }

    } catch (error) {
        // If error occurs, show error message.
        console.log(`Error fetching ${type} from URL:`, error.message);
        return null;
    }
}
// uses the safeFetch to get JSON data from a given URL.
async function fetchJSON(url) {
    return await safeFetch(url, 'json');
}
  
// uses the safeFetch to get plain text from a given URL.
async function fetchText(url) {
    return await safeFetch(url, 'text');
}

// searches Gutendex API using keyword and prints the titles of books found.
async function printBookTitles(searchTerm) {
    const url = 'https://gutendex.com/books?search=';
  
    try {
        // send request to Gutendex using the search term.
        const response = await fetch(url + encodeURIComponent(searchTerm));

        // converts API's response into JSON.
        const json = await response.json();
  
        // store the array of book results.
        const results = json.results;
  
        // print number of results and each title.
        console.log(`Found ${results.length} results for "${searchTerm}":`);
        for (let i = 0; i < results.length; ++i) {
            console.log(`${i + 1}. ${results[i].title}`);
        }

    } catch (error) {
        // show an error if issue fetching. 
        console.log('Error in printBookTitles:', error.message);
    }
}

module.exports = {
    safeFetch,
    fetchJSON,
    fetchText,
    printBookTitles
};
