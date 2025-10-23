import React, { useState } from 'react';
import './AddContactForm.css';

// Regex to validate phone numbers (allows +, digits, spaces, hyphens, parentheses)
const phoneRegex = /^\+?([0-9\s\-\(\).]{10,})$/;

function AddContactForm({ onAddContact }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Check for required fields (Name and Phone)
    if (!name || !phone) {
      alert('Please fill in both Name and Phone Number.');
      return;
    }

    // 2. Validate phone number using regex
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number (at least 10 digits, can include +, spaces, -).');
      return;
    }

    // 3. If all checks pass, add the contact
    onAddContact({ name, email, phone });
    
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="form-card">
      <h2>Add New Contact</h2>
      <form className="add-contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required // Name is still required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (Optional)</label>
          <input
            id="email"
            type="email"
            placeholder="e.g., jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // 'required' attribute removed
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g., +91 12345 67890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required // Phone is now required
          />
        </div>
        <button type="submit" className="add-btn">
          Add Contact
        </button>
      </form>
    </div>
  );
}

export default AddContactForm;