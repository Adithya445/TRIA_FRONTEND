import React from 'react';
import ContactCard from './ContactCad';
import './ContactList.css';

function ContactList({ contacts, isLoading }) {
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
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}

export default ContactList;