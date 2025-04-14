/*
    Vincent Nguyen 4/13/2025
    Ethan Umana 4/13/2025
*/

const readline = require('readline'); // Load readline for user prompts

function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();               // Close interface to clear buffer
            resolve(answer.trim());   // Return trimmed input
        });
    });
}

async function safeFetch(url, type = 'json') {
    try {
        const response = await fetch(url); // Send HTTP request

        if (response.status !== 200) {
            console.log(`Warning: status code ${response.status} when accessing ${url}`);
            return null; // Return null on bad status
        }

        // Return parsed data based on requested type
        if (type === 'json') {
            return await response.json();
        } else if (type === 'text') {
            return await response.text();
        } else {
            console.log(`Unknown fetch type: ${type}`);
            return null;
        }

    } catch (error) {
        console.log(`Error fetching ${type} from URL:`, error.message);
        return null; // Return null on network or parsing error
    }
}

/** Fetch JSON data from a URL. */
async function fetchJSON(url) {
    return await safeFetch(url, 'json');
}

/** Fetch plain text data from a URL. */
async function fetchText(url) {
    return await safeFetch(url, 'text');
}

/**
 * Search the Gutendex API and print matching book titles with IDs.
 */
async function printBookTitles(searchTerm) {
    const url = 'https://gutendex.com/books?search=';

    try {
        const response = await fetch(url + encodeURIComponent(searchTerm));
        const json = await response.json(); // Parse response

        const results = json.results;
        console.log(`Found ${results.length} results for "${searchTerm}":`);
        for (let i = 0; i < results.length; ++i) {
            console.log(`${i + 1}. ${results[i].title} - ID: ${results[i].id}`);
        }

    } catch (error) {
        console.log('Error in printBookTitles:', error.message);
    }
}

module.exports = {
    safeFetch,
    fetchJSON,
    fetchText,
    printBookTitles,
    ask
};
