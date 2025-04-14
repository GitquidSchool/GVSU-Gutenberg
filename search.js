/*
    Ethan Umana 4/13/2025
    Vincent Nguyen 4/13/2025
*/

const { safeFetch, fetchJSON, fetchText, printBookTitles, ask } = require('./utils');
const { readBook } = require('./reader');
const { addToHistory } = require('./history')

// searches for a user specified book
async function search() {
    while (true) { // first while loop handles Book title/author
        const searchKey = await ask('Enter Book Title/Author: '); // user enters title of book or book author
        await printBookTitles(searchKey); // prints matching books
        const url = 'https://gutendex.com/books?search=' + encodeURI(searchKey); // build url for api
        const data = await fetchJSON(url); // gets JSON data from api

        // checks if key word used is valid
        if (data.results.length === 0) { // if no data found restart loop 1
            console.log(`No Matches Please Try Again\n`)
            continue;
        }
        
        while (true) { // second while loop handles Book id
            // user enters ID number of book wanted
            const bookID = await ask('\nEnter The Book ID of the book you want: '); 
            const convertedID = parseInt(bookID) // converts string to integer

            // checks if id is an integer
            if (Number.isInteger(convertedID) === false){ // if not restart loop 2
                console.log(`Invalid ID. Please input intergers.\n`);
                await printBookTitles(searchKey);
                continue;
            }

            // finds the book by id
            const selectedBook = data.results.find(b => b.id === convertedID);

            if (!selectedBook) { // if no book found with ID number restart loop 2
                console.log('No ID matches. Please Try Again')
                await printBookTitles(searchKey);
                continue;
            }

            // copied from test.js
            // finds file that is plain text format
            const key = Object.keys(selectedBook.formats).find(k => k.startsWith('text/plain') && selectedBook.formats[k].endsWith('.txt.utf-8'));
            const textUrl = selectedBook.formats[key]; // gets url to plain text book

            const text = await fetchText(textUrl);
            if (text) { // if plain text file exists
                addToHistory(selectedBook); // add book to history
                await readBook(text); // read book
                return; // exit search function after reading
            } else { // if plain text file does not exists
                console.log('Failed to load book text.');
                continue; // restart loop 2
            }
        }
    }
}

module.exports = {
    search
};