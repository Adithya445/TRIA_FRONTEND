import React, { useState, useEffect, useMemo } from 'react';
import ContactList from './Components/ContactList';
import SearchBox from './Components/SearchBox';
import AddContactForm from './Components/AddContactForm';
import './App.css';

// Mock data to simulate fetching from an API
const mockContacts = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '+1 123-456-7890' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '+44 20 7946 0958' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+91 98765 43210' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '+1 456-789-0123' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', phone: '+33 1 23 45 67 89' },
];

function App() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from an API on component mount
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAllContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle adding a new contact
  const addContact = (newContact) => {
    setAllContacts([
      { ...newContact, id: Date.now() },
      ...allContacts,
    ]);
  };

  // --- NEW FUNCTION ---
  // Handle deleting a contact
  const deleteContact = (idToDelete) => {
    setAllContacts(allContacts.filter(contact => contact.id !== idToDelete));
  };

  // Use useMemo to filter contacts
  const filteredContacts = useMemo(() => {
    return allContacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allContacts, searchTerm]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Contact List</h1>
      </header>
      <main>
        <AddContactForm onAddContact={addContact} />

        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Pass the new delete function down */}
        <ContactList 
          contacts={filteredContacts} 
          isLoading={isLoading} 
          onDeleteContact={deleteContact} 
        />
      </main>
    </div>
  );
}

export default App;