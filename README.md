# Tria React Assignment - Contact List

This project is a simplified contact list application built with React, as per the Tria assignment.

It implements all the core features:
* Viewing a list of contacts
* Searching contacts by name
* Adding a new contact to the list

## Deployed Application

**Link:** `https://tria-frontend.vercel.app/`



## Source Code

**GitHub Repository:** `https://github.com/Adithya445/TRIA_FRONTEND`

## How to Run Locally

This project was bootstrapped with Vite.

1.  Clone the repository:
    `git clone https://github.com/Adithya445/TRIA_FRONTEND.git`
2.  Navigate into the project directory:
    `cd TRIA_FRONTEND`
3.  Install dependencies:
    `npm install`
4.  Start the development server:
    `npm run dev`

The application will be running at `http://localhost:5173` (or the next available port).

## Assumptions & Design Choices

As the requirements left many details open to interpretation, I made the following decisions:

* **API Mocking**: I simulated an API call using `useEffect` and a `setTimeout` of 1 second. This demonstrates handling loading states.
* **Optional Feature**: I chose to implement the "Add a new contact" feature to demonstrate form handling and state updates.
* **UI/UX**:
    * I used a simple, modern card-based design with a light gray background.
    * A loading spinner is shown while contacts are "fetched."
    * A "No contacts found" message appears if the search yields no results.
    * The "Add Contact" form is a clean card at the top of the page.
    * Contact cards feature a CSS-generated "avatar" using the contact's initials for a better visual feel.
* **State Management**: All state is managed locally within React components using `useState`, `useEffect`, and `useMemo` hooks. No external state management libraries were needed.
* **Search**: The search is case-insensitive and filters contacts in real-time as the user types.

## Libraries Used

* **React**: Required by the assignment. I used functional components and hooks (`.jsx` files) for all logic.
* **Vite**: Used as the build tool for a fast development environment.
* **No other auxiliary libraries** were used. All styling is done with plain CSS, and all functionality is handled by React itself.