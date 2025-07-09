import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  // State: an array of note objects {id, title, content, createdAt}
  const [notes, setNotes] = useState([]);
  // Modal state control
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  // Input states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  // Responsive grid/list use
  const [gridView, setGridView] = useState(true);

  // PUBLIC_INTERFACE
  function openCreateModal() {
    setIsCreateOpen(true);
    setNewTitle('');
    setNewContent('');
  }
  // PUBLIC_INTERFACE
  function closeCreateModal() {
    setIsCreateOpen(false);
    setNewTitle('');
    setNewContent('');
  }
  // PUBLIC_INTERFACE
  function openEditModal(note) {
    setEditNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditOpen(true);
  }
  // PUBLIC_INTERFACE
  function closeEditModal() {
    setEditNote(null);
    setEditTitle('');
    setEditContent('');
    setIsEditOpen(false);
  }
  // PUBLIC_INTERFACE
  function handleCreateNote(e) {
    e.preventDefault();
    if (newTitle.trim() === '' && newContent.trim() === '') return;
    const note = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      createdAt: new Date().toISOString()
    };
    setNotes([note, ...notes]);
    closeCreateModal();
  }
  // PUBLIC_INTERFACE
  function handleEditNote(e) {
    e.preventDefault();
    setNotes(notes.map(n =>
      n.id === editNote.id ? { ...n, title: editTitle, content: editContent } : n
    ));
    closeEditModal();
  }
  // PUBLIC_INTERFACE
  function handleDeleteNote(id) {
    setNotes(notes.filter(n => n.id !== id));
  }

  // PUBLIC_INTERFACE
  function renderNotes() {
    if (notes.length === 0) {
      return (
        <div className="notes-empty">
          <p>No notes found.<br/>Click <strong>New Note</strong> to get started!</p>
        </div>
      );
    }
    return (
      <div className={gridView ? 'notes-grid' : 'notes-list'}>
        {notes.map(note => (
          <div className={gridView ? 'note-card' : 'note-list-item'} key={note.id}>
            <div
              className="note-content"
              onClick={() => openEditModal(note)}
              tabIndex={0}
              role="button"
              aria-label="Edit note"
            >
              <div className="note-title">{note.title || <span className="note-placeholder">Untitled</span>}</div>
              <div className="note-text">{note.content}</div>
            </div>
            <button
              className="note-delete-btn"
              title="Delete note"
              onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function toggleViewMode() {
    setGridView(x => !x);
  }

  return (
    <div className="notes-app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand" style={{ color: 'var(--primary)' }}>
          <span role="img" aria-label="Notes" style={{marginRight: '8px', fontSize: '1.2em'}}>📝</span>
          NoteMaster
        </div>
        <div className="navbar-actions">
          <button
            className="btn-accent"
            onClick={openCreateModal}
            aria-label="Create new note"
          >
            + New Note
          </button>
          <button
            className="btn-secondary"
            onClick={toggleViewMode}
            aria-label={gridView ? 'Switch to list view' : 'Switch to grid view'}
          >
            {gridView ? (
              <span title="List view" role="img" aria-label="List">&#9776;</span>
            ) : (
              <span title="Grid view" role="img" aria-label="Grid">&#9632;&#9632;&#9632;</span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="notes-main">
        {renderNotes()}
      </main>

      {/* Modal - Create Note */}
      {isCreateOpen && (
        <Modal onClose={closeCreateModal} title="Create Note">
          <form className="note-form" onSubmit={handleCreateNote}>
            <label>
              Title
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                maxLength={32}
                placeholder="Note title"
                autoFocus
              />
            </label>
            <label>
              Content
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Write your note here"
                rows={5}
              />
            </label>
            <div className="modal-actions">
              <button className="btn-primary" type="submit">Create</button>
              <button className="btn" type="button" onClick={closeCreateModal}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
      {/* Modal - Edit Note */}
      {isEditOpen && (
        <Modal onClose={closeEditModal} title="Edit Note">
          <form className="note-form" onSubmit={handleEditNote}>
            <label>
              Title
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                maxLength={32}
                autoFocus
              />
            </label>
            <label>
              Content
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={5}
              />
            </label>
            <div className="modal-actions">
              <button className="btn-primary" type="submit">Save</button>
              <button className="btn" type="button" onClick={closeEditModal}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}


// PUBLIC_INTERFACE
function Modal({ onClose, children, title }) {
  // Trap the ESC key
  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  // Trap focus
  const modalRef = React.useRef(null);
  React.useEffect(() => {
    if (modalRef.current) modalRef.current.focus();
  }, []);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="modal" ref={modalRef} tabIndex={0}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default App;
