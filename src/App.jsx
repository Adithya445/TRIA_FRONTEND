import React, { useState, useEffect, useMemo } from 'react';
import ContactList from './Components/ContactList'; // Corrected path
import SearchBox from './Components/SearchBox';     // Corrected path
import AddContactForm from './Components/AddContactForm'; // Corrected path
import './App.css';

// Mock data to simulate fetching from an API [cite: 14]
const mockContacts = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '123-456-7890' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '234-567-8901' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '456-789-0123' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', phone: '567-890-1234' },
];

function App() {
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from an API on component mount [cite: 14]
  useEffect(() => {
    setIsLoading(true);
    // Simulate a 1-second network delay
    setTimeout(() => {
      setAllContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle adding a new contact (for the optional feature) 
  const addContact = (newContact) => {
    // In a real app, this would also post to an API
    // We add it to the top of the list for immediate visibility
    setAllContacts([
      { ...newContact, id: Date.now() }, // Use timestamp for a simple unique ID
      ...allContacts,
    ]);
  };

  // Use useMemo to filter contacts only when the list or search term changes
  // This implements the search feature [cite: 6]
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
        {/* Implement "Add a new contact" feature  */}
        <AddContactForm onAddContact={addContact} />

        {/* Implement "Search contact by name" feature [cite: 6] */}
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Implement "View the list of contacts" feature [cite: 5] */}
        <ContactList contacts={filteredContacts} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;