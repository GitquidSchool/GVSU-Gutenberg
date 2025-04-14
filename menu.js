const readline = require('readline');
const { safeFetch, fetchJSON, fetchText, printBookTitles, ask } = require('./utils');
const { readBook } = require('./reader');
const { search } = require('./search')
const { loadHistory, saveHistory, addToHistory, listHistory, getBookFromHistory } = require('./history')


// this what I was thinking for displaying, JUST ROUGH DRAFT THO:
// === Project Gutenberg Reader ===
// Search for a book
// View reading history
// Re-read a book from history
// Quit
// Select an option: _ 

async function menu() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    while (true) {
        console.log('=== Project Gutenberg Reader ===');
        console.log('1. Search for a book');
        console.log('2. View reading history');
        console.log('3. Re-read a book from history');
        console.log('4. Quit');

        const choice = await ask(rl, 'Select an Option: ');
        if (choice === '1'){
            rl.close();
            await search();
            break;
        }
        if (choice === '2'){
            listHistory();
            console.log(`\n`)
        }
        if (choice === '3'){
            listHistory();
            const bookChoice = await ask(rl, "Select a Book: ")
            const bookIndex = parseInt(bookChoice)
            const book = getBookFromHistory(bookIndex - 1);
            if (book) {
                const url = 'https://gutendex.com/books?search=' + encodeURI(book);
                const data = await fetchJSON(url);

                const key = Object.keys(book.formats).find(k => k.startsWith('text/plain') && book.formats[k].endsWith('.txt.utf-8'));
                const textUrl = book.formats[key];

                // uses readBook() in utils.js file
                const text = await fetchText(textUrl);
                if (text) {
                    await readBook(text);
                    break;
                }
            } else {
                console.log('Invalid Choice')
            }
        }
        if (choice === '4'){
            console.log('quit');
            rl.close();
            return;
        } else {
            console.log('Invalid Choice');
        }
    }
}

menu();