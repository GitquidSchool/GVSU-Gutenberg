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
    console.log('\n📖 Test: fetchText using valid text URL from Gutendex');
    const data = await fetchJSON('https://gutendex.com/books?search=pride%20and%20prejudice');

    if (data && data.results.length > 0) {
        const book = data.results[0];
        const textUrl =
            book.formats['text/plain; charset=utf-8'] ||
            book.formats['text/plain'] ||
            null;

        if (!textUrl) {
            console.log('No plain text format available for this book.');
            return;
        }

        const text = await fetchText(textUrl);
        if (text) {
            console.log('First 300 characters:\n');
            console.log(text.substring(0, 300));
        } else {
            console.log('Failed to fetch book text.');
        }
    } else {
        console.log('No results for "Pride and Prejudice".');
    }
}

// Test 4: Test safeFetch directly
async function testSafeFetchText() {
    console.log('\nTest: safeFetch() directly with "text" type');
    const text = await safeFetch('https://www.gutenberg.org/cache/epub/84/plain/84-0.txt', 'text');
    if (text) {
        console.log('First 200 characters:\n');
        console.log(text.substring(0, 200));
    } else {
        console.log('safeFetch() failed.');
    }
}

// Run all tests in order
async function runTests() {
    await testPrintBookTitles();
    await testFetchJSON();
    await testFetchText();
    await testSafeFetchText();
}

runTests();
