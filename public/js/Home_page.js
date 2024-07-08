document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });
});
const addBtn = document.querySelector('.add-btn');
const editBtns = document.querySelectorAll('.edit-btn');
const deleteBtns = document.querySelectorAll('.delete-btn');

addBtn.addEventListener('click', async () => {
  const title = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;
  try {
    const response = await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    window.location.href = '/';
  } catch (err) {
    console.error(err);
  }
});

editBtns.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const noteId = btn.dataset.noteId;
    try {
      const response = await fetch(`/edit/${noteId}`, {
        method: 'GET',
      });
      const note = await response.json();
      // Display the edit modal with the note data
      const editModal = document.querySelector('#edit-note-modal');
      editModal.querySelector('#title').value = note.title;
      editModal.querySelector('#content').value = note.content;
      editModal.style.display = 'block';
    } catch (err) {
      console.error(err);
    }
  });
});

deleteBtns.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const noteId = btn.dataset.noteId;
    try {
      const response = await fetch(`/delete/${noteId}`, {
        method: 'POST',
      });
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  });
});