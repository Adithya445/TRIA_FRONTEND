import React from 'react';
import './ContactCard.css';

// Helper function to get initials from a name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

function ContactCard({ contact }) {
  const initials = getInitials(contact.name);

  return (
    <div className="contact-card">
      <div className="contact-avatar">
        <span>{initials}</span>
      </div>
      <div className="contact-details">
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-info email">{contact.email}</p>
        {contact.phone && (
          <p className="contact-info phone">{contact.phone}</p>
        )}
      </div>
    </div>
  );
}

export default ContactCard;