import React from 'react';
import ContactCard from './ContactCard';
import './ContactList.css';

// Accept onDeleteContact as a prop
function ContactList({ contacts, isLoading, onDeleteContact }) {
  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <p>No contacts found.</p>
        <p>Try adjusting your search or add a new contact!</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        // Pass the delete handler to each card
        <ContactCard 
          key={contact.id} 
          contact={contact} 
          onDelete={onDeleteContact} 
        />
      ))}
    </div>
  );
}

export default ContactList;