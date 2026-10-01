let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
  ];


  // searchNotes function
  function searchNotes(word) {
    const searchResult = word.toLowerCase();

    return notes.filter(note => note.text.toLowerCase().includes(searchResult));
    
  }

  // longestNote function
  function longestNote() {
    if(notes.length === 0) {
      return null;
    }

    let longest = notes[0];

    for (let i = 1; i < notes.length; i++) {
      if (notes[i].text.length > longest.text.length) {
        longest = notes[i];
      }
    }

    return longest;
  }


// countByCategory function
  function countByCategory(){
    const categoryCount = {};
    
    for (const note of notes) {
      if (categoryCount[note.category]) {
        categoryCount[note.category]++;
      } else {
        categoryCount[note.category] = 1;
      }
    }
    return categoryCount;

  }
  
// getSummary function
  function getSummary() {
    const totalNotes = notes.length;
    const categoryCount = countByCategory();
    const noteWords = totalNotes === 1 ? "note" : "notes";

    return `You have ${totalNotes} ${noteWords}. Categories: ${categoryCount.personal || 0} personal, ${categoryCount.work || 0} work., ${categoryCount.study || 0} study`;
  }

// isDuplicate function
  function isDuplicate(text) {
    const textNew = text.trim().toLowerCase();
    return notes.some(note => note.text.trim().toLowerCase() === textNew);
  }

// addNote function
  function addNote(text, category) {
    const newNote = text.trim();
    const checkCategory = ["personal", "work", "study"];

    if (newNote.length < 1 || newNote.length > 200) {
      return "Note text must be between 1 and 200 characters.";
    }

    if(isDuplicate(newNote)) {
      return "This note already exists.";
    }

    if (!checkCategory.includes(category)) {
      return "Invalid category. Please choose from 'personal', 'work', or 'study'.";
    }

    const newId = notes.length === 0 ? 1 : Math.max(...notes.map(note => note.id)) + 1;

    notes.push({ id: newId, text: newNote, category: category });
    console.log(`Note added successfully: "${newNote}" in category "${category}".`);
      return true;
  
  }

  // Test cases for the searchNotes function
  console.log(searchNotes("milk")); // should return the note with id 1, which contains the word "milk" { id: 1, text: "Buy milk and bread", category: "personal" }
  console.log(searchNotes("Code a little")); // should return an empty array since no note contains this phrase

// Test cases for the longestNote function
  console.log(longestNote()); // Should return the note with id 3, which has the longest text { id: 3, text: "Email the project report to Grace", category: "work" }
  const originalNote = notes;
  notes = [];
  console.log(longestNote()); // Should return null since there are no notes in the array
  notes = originalNote;

  // Test cases for the countByCategory function
  console.log(countByCategory()); // Should return an object with the count of notes in each category, e.g., { personal: 2, study: 2, work: 1 }
  notes = [];
  console.log(countByCategory()); // Should return an empty object since there are no notes in the array
  notes = originalNote; // Restore the original notes array

  // Test cases for the getSummary function
  console.log(getSummary()); // Should return a summary string, e.g., "You have 5 notes. Categories: 2 personal, 1 work, 2 study"
  notes = [];
  console.log(getSummary()); // Should return "You have 0 notes. Categories: 0 personal, 0 work, 0 study"
  notes = originalNote; // Restore the original notes array

  // Test cases for the isDuplicate function
  console.log(isDuplicate("Finish the Day 3 assignment")); // Should return true since this note already exists
  console.log(isDuplicate("Go for a walk")); // Should return false since this note does not exist

  // Test cases for the addNote function
  console.log(addNote("Go for a bootcamp", "study")); // Should return true and add the note to the notes array
  console.log(addNote("Finish the Day 3 assignment", "study")); // Should return "This note already exists."
  console.log(addNote("New note", "Coder")); // Should return an error message about invalid category