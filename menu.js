/*
    Ethan Umana 4/13/2025
    Vincent Nguyen 4/13/2025
*/

const { safeFetch, fetchJSON, fetchText, printBookTitles, ask } = require('./utils');
const { readBook } = require('./reader');
const { search } = require('./search')
const { loadHistory, saveHistory, addToHistory, listHistory, getBookFromHistory } = require('./history')

// main menu of project
async function menu() {
    while (true) { // handles user inputs and restarts for invalid inputs
        // welcome message
        console.log('=== Project Gutenberg Reader ===');
        console.log('1. Search for a book');
        console.log('2. View reading history');
        console.log('3. Re-read a book from history');
        console.log('4. Quit');

        const choice = await ask('Select an Option: '); // user enters number 1-4

        if (choice === '1'){ // search for book
            console.clear();
            await search(); // uses search function to find book
            console.clear();
            continue; // breaks loop so welcome message doesnt appear when reading book
        }
        else if (choice === '2'){ // view history
            console.clear();
            listHistory(); // prints list of recent books
        }
        else if (choice === '3'){ // rereading a book
            console.clear();
            listHistory(); // prits list of recent books
            const history = loadHistory(); // variable that holds history of books list
            const bookChoice = await ask(`Select a Book from 1-${history.length}: `) // user enters books index from list
            const bookIndex = parseInt(bookChoice) // changes user input from string to integer
            const book = getBookFromHistory(bookIndex - 1); // get selected book from history list

            if (book) { // if book in history list
                // Look inside formats to find a plain text of book
                const key = Object.keys(book.formats).find(k =>
                    k.startsWith('text/plain') && book.formats[k].endsWith('.txt.utf-8'));
                // Get URL to actual plain-text
                const textUrl = book.formats[key];
                // download book from link
                const text = await fetchText(textUrl);

                // If got book text, open in reader
                if (text) {
                    await readBook(text);
                    console.clear();
                    //console.log();   
                    continue;  
                } else {
                    console.log('Failed to fetch book text.');
                    console.log();
                }   

            } else { // if book not in history list
                console.log('Invalid Choice')
                console.log();
            }
        }
        else if (choice === '4'){ // quiting program
            console.clear();
            console.log('quit');
            return;
        } else { // if user input is not a number between 1-4
            console.clear();
            console.log('Invalid Choice');
        }
    }
}

module.exports = {
    menu
};