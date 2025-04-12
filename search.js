const readline = require('readline');
const { safeFetch, fetchJSON, fetchText, printBookTitles, ask } = require('./utils');
const { readBook } = require('./reader');

// searches for a user specified book
async function search() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
        // user enters title of book or book author
        const searchKey = await ask(rl, 'Enter Book Title/Author: ');
        await printBookTitles(searchKey);
        const url = 'https://gutendex.com/books?search=' + encodeURI(searchKey);
        const data = await fetchJSON(url);

        // checks if key word used is valid
        if (data.results.length === 0) {
            console.log(`No Matches Please Try Again\n`)
            continue;
        }

        while (true) {
            // user enters ID number of book wanted
            const bookID = await ask(rl, '\nEnter The Book ID of the book you want: ');
            const convertedID = parseInt(bookID)

            // checks if id is valid
            if (Number.isInteger(convertedID) === false){
                console.log(`Invalid ID. Please input intergers.\n`);
                await printBookTitles(searchKey);
                continue;
            }

            // finds the book by id attribute
            const selectedBook = data.results.find(b => b.id === convertedID);

            if (!selectedBook) {
                console.log('No ID matches. Please Try Again')
                await printBookTitles(searchKey);
                continue;
            }

            // copied from utils.js file
            // grabs the specified file
            const key = Object.keys(selectedBook.formats).find(k => k.startsWith('text/plain') && selectedBook.formats[k].endsWith('.txt.utf-8'));
            const textUrl = selectedBook.formats[key];

            // uses readBook() in utils.js file
            const text = await fetchText(textUrl);
            if (text) {
                rl.close();
                await readBook(text);
                return;
            } else {
                console.log('Failed to load book text.');
            }
        }
    }
}

function isBook(book, shelf){
    return book.id === shelf.results.id;
}
module.exports = {
    search
};

search();