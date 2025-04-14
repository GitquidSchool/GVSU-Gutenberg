/*
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

// Displays the book, one page at a time.
async function readBook(fullText, charsPerPage = 1000) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    // Split the full book into pages
    const pages = paginateByLines(fullText, charsPerPage);
    let currentPage = 0;

    function showPage(index) {
        console.clear();
        console.log(`\n--- Page ${index + 1} of ${pages.length} ---\n`);
        console.log(pages[index]); 
        console.log(`\n Next (→) | Back (←) | Quit (q)\n`);
    }

    showPage(currentPage);

    process.stdin.on('keypress', (str, key) => {
        if (key.name === 'right') {
            if (currentPage < pages.length - 1) {
                currentPage++;
                showPage(currentPage);
            }
        } else if (key.name === 'left') {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        } else if (key.name === 'q') {
            console.log('\nReading has been halted.');
            rl.close();
            process.exit();
        }
    });
}

module.exports = {
    readBook
};
