const readline = require('readline');
const { safeFetch, fetchJSON, fetchText, printBookTitles } = require('./utils');
const { addToHistory, listHistory, loadHistory, getBookFromHistory, saveHistory } = require('./history');
const { readBook } = require('./reader');

// Test 1: Test printBookTitles
async function testPrintBookTitles() {
    console.log('\nTest: printBookTitles("sherlock")');
    await printBookTitles("sherlock");
}

// Test 2: Test fetchJSON with Gutendex
async function testFetchJSON() {
    console.log('\nTest: fetchJSON with Gutendex search for "austen"');
    const data = await fetchJSON('https://gutendex.com/books?search=austen');
    if (data && data.results) {
        console.log(`Success: Found ${data.results.length} books`);
    } else {
        console.log('Failed to fetch JSON data.');
    }
}

// Test 3: Test fetchText with known Gutenberg book
async function testFetchText() {
    console.log('\nTest: fetchText using valid text URL from Gutendex (Frankenstein)');

    const data = await fetchJSON('https://gutendex.com/books?search=frankenstein');

    if (!data || data.results.length === 0) {
        console.log('No results found.');
        return;
    }

    // Pick book that has correct plain text format
    const book = data.results.find(b => {
        const formats = b.formats || {};
        return Object.keys(formats).some(key =>
            key.startsWith('text/plain') && formats[key].endsWith('.txt.utf-8')
        );
    });

    if (!book) {
        console.log('No book with valid plain text format found.');
        return;
    }

    // Get matching formatcl dynamically
    const textUrlKey = Object.keys(book.formats).find(key =>
        key.startsWith('text/plain') && book.formats[key].endsWith('.txt.utf-8')
    );

    const textUrl = book.formats[textUrlKey];

    const text = await fetchText(textUrl);
    if (text) {
        const snippet = text.slice(0, 300);
        console.log(`fetchText succeeded. Showing ${snippet.length} characters:\n`);
        console.log('START>>>' + snippet + '<<<END');
    } else {
        console.log('fetchText failed to retrieve text.');
    }
}

// Test 4: Test safeFetch directly
async function testSafeFetchText() {
    console.log('\nTest: safeFetch() directly with "text" type (Frankenstein)');

    const data = await fetchJSON('https://gutendex.com/books?search=frankenstein');
    if (!data || data.results.length === 0) {
        console.log('No results found.');
        return;
    }

    const book = data.results.find(b => {
        const formats = b.formats || {};
        return Object.keys(formats).some(key =>
            key.startsWith('text/plain') && formats[key].endsWith('.txt.utf-8')
        );
    });

    if (!book) {
        console.log('No book with valid plain text format found.');
        return;
    }

    const textUrlKey = Object.keys(book.formats).find(key =>
        key.startsWith('text/plain') && book.formats[key].endsWith('.txt.utf-8')
    );

    const textUrl = book.formats[textUrlKey];

    const text = await safeFetch(textUrl, 'text');
    if (text) {
        const snippet = text.slice(0, 300);
        console.log(`safeFetch succeeded. Showing ${snippet.length} characters:\n`);
        console.log('START>>>' + snippet + '<<<END');
    } else {
        console.log('safeFetch failed to retrieve text.');
    }
}

// Test 5: Use fetchText() and readBook() 
async function testReadBook() {
    console.log('\nTest: readBook() using full text from Frankenstein');

    const data = await fetchJSON('https://gutendex.com/books?search=frankenstein');
    const book = data.results.find(b =>
        Object.keys(b.formats).some(k => k.startsWith('text/plain') && b.formats[k].endsWith('.txt.utf-8'))
    );

    const key = Object.keys(book.formats).find(k => k.startsWith('text/plain') && book.formats[k].endsWith('.txt.utf-8'));
    const textUrl = book.formats[key];

    const text = await fetchText(textUrl);
    if (text) {
        await readBook(text);
    } else {
        console.log('Failed to load book text.');
    }
}

// Book object for testing history
const testBook = {
    id: 9999,
    title: "Testing 123",
    author: "TestAuthor",
    textUrl: "https://example.com/test.txt"
};
  
// Test 6: Add a book to history
async function testAddToHistory() {
    console.log('\nTest: Adding a book to history...');
    addToHistory(testBook);
    console.log('Book added.');
}

    // Test 7: Load and show current history
async function testShowHistory() {
    console.log('\nTest: Listing book history...');
    listHistory();
}

    // Test 8: Get a book from history by index
async function testGetBookFromHistory() {
    console.log('\nTest: Getting latest book from history...');
    const book = getBookFromHistory(0);
    if (book) {
        console.log(`Found: ${book.title} by ${book.author}`);
    } else {
        console.log('No book found at index 0.');
    }
}

// Run all tests in order
async function runTests() {
    //await testPrintBookTitles();
    //await testFetchJSON();
    //await testFetchText();
    //await testSafeFetchText();
    //await testReadBook();
    await testAddToHistory();
    await testShowHistory();
    await testGetBookFromHistory();
    console.log('\nAll tests complete.');
}

runTests();
