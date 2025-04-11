const readline = require('readline');
const { safeFetch, fetchJSON, fetchText, printBookTitles } = require('./utils');

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

// Run all tests in order
async function runTests() {
    await testPrintBookTitles();
    await testFetchJSON();
    await testFetchText();
    await testSafeFetchText();
    console.log('\nAll tests complete.');
}

runTests();
