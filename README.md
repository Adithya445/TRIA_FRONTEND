# Tria React Assignment - Contact List

[cite_start]This project is a simple contact list application built with React, as per the Tria assignment.

It implements all the core features:
* [cite_start]Viewing a list of contacts [cite: 5]
* [cite_start]Searching contacts by name [cite: 6]
* (Optional) [cite_start]Adding a new contact to the list 

## Deployed Application

**Link:** `[Your Deployed URL Here]`

[cite_start]*(You will get this URL after deploying to Vercel or Netlify)* [cite: 18]

## How to Run Locally

1.  Clone the repository:
    `git clone [Your Repo URL]`
2.  Install dependencies:
    `npm install`
3.  Start the development server:
    `npm start`

The application will be running at `http://localhost:3000`.

## [cite_start]Assumptions & Design Choices [cite: 23, 28]

[cite_start]As the requirements left many details open to interpretation, I made the following decisions:

* [cite_start]**API Mocking**: I simulated an API call [cite: 14] using `useEffect` and a `setTimeout` of 1 second. [cite_start]This demonstrates handling loading states.
* [cite_start]**Optional Feature**: I chose to implement the "Add a new contact" feature  to demonstrate form handling and state updates.
* **UI/UX**:
    * [cite_start]I used a simple, modern card-based design.
    * A loading spinner is shown while contacts are "fetched."
    * A "No contacts found" message appears if the search yields no results.
    * The "Add Contact" form is a simple modal-like card at the top.
    * Contact cards feature a CSS-generated "avatar" using the contact's initials for a better visual feel.
* **State Management**: All state is managed locally within React components using `useState`, `useEffect`, and `useMemo` hooks. No external state management libraries were needed.
* **Search**: The search is case-insensitive and filters contacts in real-time as the user types.

## [cite_start]Libraries Used [cite: 24]

* [cite_start]**React**: Required by the assignment[cite: 12]. I used functional components and hooks for all logic.
* [cite_start]**No other auxiliary libraries** [cite: 13] were used. All styling is done with plain CSS, and all functionality is handled by React itself.