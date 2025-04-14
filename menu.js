/*
    Ethan Umana 4/13/2025
*/

const readline = require('readline');
const { safeFetch, fetchJSON, fetchText, printBookTitles, ask } = require('./utils');
const { readBook } = require('./reader');
const { search } = require('./search')
const { loadHistory, saveHistory, addToHistory, listHistory, getBookFromHistory } = require('./history')

// main menu of project
async function menu() {
    const rl = readline.createInterface({ // creates a readline interface for user input
        input: process.stdin,
        output: process.stdout
    });
    while (true) { // handles user inputs and restarts for invalid inputs
        // program welcome message
        console.log('=== Project Gutenberg Reader ===');
        console.log('1. Search for a book');
        console.log('2. View reading history');
        console.log('3. Re-read a book from history');
        console.log('4. Quit');

        const choice = await ask(rl, 'Select an Option: '); // user enters number 1-4
        if (choice === '1'){ // search for book
            rl.close(); // closes readline to avoid double input
            await search(); // uses search function to find book
            break; // breaks loop so welcome message doesnt appear when readig book
        }
        else if (choice === '2'){ // view history
            listHistory(); // prints list of recent books
        }
        else if (choice === '3'){ // rereading a book
            listHistory(); // prits list of recent books
            const history = loadHistory(); // variable that holds history of books list
            const bookChoice = await ask(rl, `Select a Book from 1-${history.length}: `) // user enters books index from list
            const bookIndex = parseInt(bookChoice) // changes user input from string to integer
            const book = getBookFromHistory(bookIndex - 1); // get selected book from history list
            if (book) { // if book in history list
                const url = 'https://gutendex.com/books?search=' + encodeURI(book); // make url for api
                const data = await fetchJSON(url); // fetch JSON data from api

                // copied from test.js
                // finds file that is plain text format
                const key = Object.keys(book.formats).find(k => k.startsWith('text/plain') && book.formats[k].endsWith('.txt.utf-8'));
                const textUrl = book.formats[key]; // gets url to plain text book

                // uses readBook() in utils.js file
                const text = await fetchText(textUrl);
                if (text) { // if plain text file exists
                    await readBook(text); // read book
                    break; // breaks loop so welcome message doesnt appear when readig book
                }
            } else { // if book not in history list
                console.log('Invalid Choice')
            }
        }
        else if (choice === '4'){ // quiting program
            console.log('quit');
            rl.close(); // closes readline for user input
            return;
        } else { // if user input is not a number between 1-4
            console.log('Invalid Choice');
        }
    }
}

module.exports = {
    menu
};