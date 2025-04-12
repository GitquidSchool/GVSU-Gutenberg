const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'history.json');

// Read history or return empty list if doesn't exist.
function loadHistory() {
    try {
        const data = fs.readFileSync(HISTORY_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Save history.
function saveHistory(history) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Add to history. Keep only last 10.
function addToHistory(book) {
    const history = loadHistory();

    // Remove if it's in history
    const filtered = history.filter(entry => entry.id !== book.id);

    // Add to top of list
    filtered.unshift(book);

    // Keep last 10
    const limited = filtered.slice(0, 10);

    saveHistory(limited);
}

// Show in terminal.
function listHistory() {
    const history = loadHistory();

    if (history.length === 0) {
        console.log('\nNo history found.\n');
        return;
    }

    console.log('\nRecent Books:\n');
    history.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author}`);
    });
}

// Get book by index.
function getBookFromHistory(index) {
    const history = loadHistory();
    if (index >= 0 && index < history.length) {
        return history[index];
    }
    return null;
}

module.exports = {
    loadHistory,
    saveHistory,
    addToHistory,
    listHistory,
    getBookFromHistory
};
