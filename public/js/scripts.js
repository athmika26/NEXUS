document.addEventListener('DOMContentLoaded', function() {
    // Function to load a template
    window.loadTemplate = function(template) {
      const title = document.getElementById('note-title');
      const content = document.getElementById('note-content');
  
      switch (template) {
        case 'lecture':
          title.value = 'Lecture: [Subject] - [Date]';
          content.value = 'Key Points:\n\n1.\n2.\n3.\n\nSummary:\n\n';
          break;
        case 'research':
          title.value = 'Research Topic: [Title]';
          content.value = 'Introduction:\n\n\n\nMethodology:\n\n\n\nResults:\n\n\n\nConclusion:\n\n\n\nReferences:\n\n';
          break;
        default:
          title.value = '';
          content.value = '';
      }
    };
  
    // Function to save a note (you can expand this function to save notes to a server or local storage)
    window.saveNote = function() {
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
  
      if (title && content) {
        alert('Note Saved:\n\nTitle: ' + title + '\nContent: ' + content);
        // You can replace the alert with code to save the note to a database or local storage
      } else {
        alert('Please fill in both the title and content fields.');
      }
    };
  });
  