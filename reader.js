/*
    Vincent Nguyen 4/13/2025
    Ethan Umana 4/13/2025
*/

const readline = require('readline');

function paginateByLines(text, charsPerPage = 1000) {
    const lines = text.split('\n');
    const pages = [];
    let page = "";

    for (let line of lines) {
        const nextPage = page + line + '\n';
        if (nextPage.length > charsPerPage) {
            pages.push(page.trimEnd());
            page = line + '\n';
        } else {
            page = nextPage;
        }
    }
    if (page.length > 0) {
        pages.push(page.trimEnd());
    }
    return pages;
}

// Displays the book, one page at a time
async function readBook(fullText, charsPerPage = 1000) {
    if (process.stdin.isPaused()) {
        process.stdin.resume(); 
    }
    // readline for keypresses
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    const pages = paginateByLines(fullText, charsPerPage);
    let currentPage = 0;

    function showPage(index) {
        console.clear();
        console.log(`\n--- Page ${index + 1} of ${pages.length} ---\n`);
        console.log(pages[index]);
        console.log(`\n Next (→) | Back (←) | Quit (q)\n`);
    }

    // Main loop
    while (true) {
        showPage(currentPage);

        // Wait for keypress 
        const key = await new Promise(resolve => {
            process.stdin.once('keypress', (_str, key) => resolve(key));
        });

        if (key.name === 'q') {
            console.log('\nReading halted, returning to Menu.\n');
            break;
        }
        if (key.name === 'right' && currentPage < pages.length - 1) {
            currentPage++;
        } else if (key.name === 'left' && currentPage > 0) {
            currentPage--;
        }
    }

    // Clean up
    process.stdin.setRawMode(false);
    process.stdin.pause();
}

module.exports = {
    readBook
};
