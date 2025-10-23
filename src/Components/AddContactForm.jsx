import React, { useState } from 'react';
import './AddContactForm.css';

function AddContactForm({ onAddContact }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in at least name and email.');
      return;
    }
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
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="e.g., jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g., 123-456-7890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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