document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menu-toggle");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });

    const addBtn = document.querySelector('.add-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');

    addBtn.addEventListener('click', async () => {
        const title = document.querySelector('#add-title').value;
        const content = document.querySelector('#add-content').value;
        console.log(title, content); // Debug
        try {
            const response = await fetch('/home/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content }),
            });
            if (response.ok) {
                window.location.href = '/home';
            } else {
                console.error('Failed to add note', response);
            }
        } catch (err) {
            console.error(err);
        }
    });

    editBtns.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const noteId = btn.dataset.noteId;
            console.log('Editing note ID:', noteId); // Debug
            try {
                const response = await fetch(`/home/edit/${noteId}`, {
                    method: 'GET',
                });
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const note = await response.json();
                        console.log('Fetched note data:', note); // Debug
                        const editModal = document.querySelector('#edit-note-modal');
                        editModal.querySelector('#edit-title').value = note.title;
                        editModal.querySelector('#edit-content').value = note.content;
                        editModal.style.display = 'block';
                        editModal.querySelector('form').addEventListener('submit', async (e) => {
                            e.preventDefault();
                            const updatedTitle = editModal.querySelector('#edit-title').value;
                            const updatedContent = editModal.querySelector('#edit-content').value;
                            try {
                                const updateResponse = await fetch(`/home/edit/${noteId}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
                                });
                                if (updateResponse.ok) {
                                    window.location.href = '/home';
                                } else {
                                    console.error('Failed to update note', updateResponse);
                                }
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    } else {
                        const html = await response.text();
                        document.open();
                        document.write(html);
                        document.close();
                    }
                } else {
                    console.error('Failed to fetch note', response);
                }
            } catch (err) {
                console.error(err);
            }
        });
    });

    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', async () => {
            const noteId = btn.dataset.noteId;
            console.log('Deleting note ID:', noteId); // Debug
            try {
                const response = await fetch(`/home/delete/${noteId}`, {
                    method: 'POST',
                });
                if (response.ok) {
                    window.location.href = '/home';
                } else {
                    console.error('Failed to delete note', response);
                }
            } catch (err) {
                console.error(err);
            }
        });
    });

    const archiveButtons = document.querySelectorAll('.archive-btn');
    archiveButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.dataset.noteId;
            archiveNote(noteId);
        });
    });
});

async function archiveNote(noteId) {
    try {
        console.log(noteId);
        const response = await fetch(`/home/${noteId}/archive`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log(`Archived note with ID: ${noteId}`);
            document.querySelector(`.note-box[data-note-id="${noteId}"]`).remove();
        } else {
            console.error('Failed to archive note');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
