const readline = require('readline');
const { safeFetch, fetchJSON, fetchText, printBookTitles, ask } = require('./utils');
const { readBook } = require('./reader');

// searches for a user specified book
async function search() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // user enters title of book or book author
    const searchKey = await ask(rl, 'Enter Book Title/Author: ');
    await printBookTitles(searchKey);
    const url = 'https://gutendex.com/books?search=' + encodeURI(searchKey);
    const data = await fetchJSON(url);

    // checks if key word used is valid
    if (data.results.length === 0) {
        console.log('No Books Matched Your Search.');
        rl.close();
        return;
    }

    // user enters ID number of book wanted
    const bookID = await ask(rl, '\nEnter The Book ID of the book you want: ');
    const convertedID = parseInt(bookID)

    // checks if id is valid
    if (Number.isInteger(convertedID) === false){
        console.log('Invalid ID');
        rl.close();
        return;
    }

    // copied from utils.js file
    // finds the allowed book files
    const selectedBook = data.results.find(b =>
        Object.keys(b.formats).some(k => k.startsWith('text/plain') && b.formats[k].endsWith('.txt.utf-8'))
    );

    // copied from utils.js file
    // grabs the specified file
    const key = Object.keys(selectedBook.formats).find(k => k.startsWith('text/plain') && selectedBook.formats[k].endsWith('.txt.utf-8'));
    const textUrl = selectedBook.formats[key];

    // uses readBook() in utils.js file
    const text = await fetchText(textUrl);
    if (text) {
        await readBook(text);
    } else {
        console.log('Failed to load book text.');
    }
}
module.exports = {
    search
};

search();