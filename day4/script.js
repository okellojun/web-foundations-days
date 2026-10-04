const noteText = document.querySelector('#note-text');
const charCount = document.querySelector('#char-count');
const wordCount = document.querySelector('#word-count');
const clearBtn = document.querySelector('#clear-btn');
const themeToggle = document.querySelector('#theme-toggle');


const STORAGE_KEY = 'noteAppData';
const STORAGE_THEME_KEY = 'noteAppTheme';


// Function to update character and word counts and apply styling state
function updateCounts() {
    const text = noteText.value;
    const length = text.length;

    charCount.textContent = `${length} / 200 characters`;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCount.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;

    charCount.classList.remove('warning', 'over');
    if (length > 200) {
        charCount.classList.add('over');
    } else if (length > 180) {
        charCount.classList.add('warning');
    }
}

// Clear text, reset UI, and remove data from localStorage
function clearAll() {
    noteText.value = '';
    localStorage.removeItem(STORAGE_KEY);
    updateCounts();
    noteText.focus();
}

// Toggle between light and dark themes and save preference to localStorage
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark');
    themeToggle.textContent = isDarkMode ? "Light mode" : "Dark mode";
    localStorage.setItem(STORAGE_THEME_KEY, isDarkMode ? 'dark' : 'light');
}

// Input event
noteText.addEventListener('input', () => {
    localStorage.setItem(STORAGE_KEY, noteText.value);
    updateCounts();
});

// Keydown event to clear text when Escape key is pressed
noteText.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        clearAll();
    }
});

//  Click Events
clearBtn.addEventListener('click', clearAll);
themeToggle.addEventListener('click', toggleTheme);

// Load saved data and theme preference from localStorage on page load
function init() {
    // restore theme preference
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }

    // restore note text
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText !== null) {
        noteText.value = savedText;
    }
    updateCounts();
}

// Initialize the app
init();
