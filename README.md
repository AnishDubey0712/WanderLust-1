# WanderLust

WanderLust is a web application designed to help users explore and share travel destinations. It includes features for listing travel destinations, writing and viewing reviews, and user authentication.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Project Description](#project-description)
- [Routes](#routes)
- [Error Handling](#error-handling)

## Installation

To get started with WanderLust, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/WanderLust.git
    cd WanderLust
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```



3. Start the MongoDB server:
    ```bash
    mongod
    ```

4. Run the application:
    ```bash
    node app.js
    ```

## Usage

1. Navigate to `http://localhost:8080` in your web browser.
2. Register or log in to start exploring and adding travel destinations.

## Features

- **Listings:** Users can view and add travel destinations.
- **Reviews:** Users can write reviews for listed destinations.
- **Search:** Users can search for destinations by title, location, or country.
- **Categories:** Browse destinations by categories.
- **User Authentication:** Users can sign up, log in, and manage their sessions.

## Project Description

### User Authentication

Implemented user authentication using Passport.js with a local strategy. Users can sign up, log in, and log out. Sessions are managed using `express-session` and `connect-flash` for flash messages.

### Listings Management

Users can create, view, edit, and delete travel destination listings. Listings are stored in a MongoDB database using Mongoose for schema management. EJS templates are used to render views for listing management.

### Reviews System

Users can add reviews to listings, which are also stored in the MongoDB database. Reviews can be deleted by the user who created them. The review system ensures that the feedback on listings is genuine and valuable.

### Search and Categories

Implemented a search feature that allows users to search for listings by title, location, or country using regex for partial and case-insensitive matching. Additionally, users can browse listings by categories.

### Middleware and Error Handling

Used various middleware for data parsing, method overriding, and static file serving. Implemented custom error handling to manage validation errors and other runtime errors gracefully.

## Routes

### User Routes

- `GET /signup`: Displays the signup form.
- `POST /signup`: Handles user registration.
- `GET /login`: Displays the login form.
- `POST /login`: Handles user authentication.
- `GET /logout`: Logs out the user.

### Listings Routes

- `GET /Listings`: Displays all listings.
- `GET /Listings/new`: Displays the form to add a new listing.
- `POST /Listings`: Adds a new listing.
- `GET /Listings/:id`: Displays details for a specific listing.
- `GET /Listings/:id/edit`: Displays the form to edit a listing.
- `PUT /Listings/:id`: Updates a listing.
- `DELETE /Listings/:id`: Deletes a listing.

### Reviews Routes

- `POST /Listings/:id/reviews`: Adds a review to a listing.
- `DELETE /Listings/:id/reviews/:reviewId`: Deletes a review from a listing.

### Category Routes

- `GET /category/:category`: Displays listings in a specific category.

### Search Routes

- `GET /search`: Searches for listings based on a search term.

## Error Handling

- If a route is not found, the user is redirected to a 404 error page with the message "Page not found!".
- Generic error handling middleware catches and displays errors with a status code and message.

## Note
- If some error occurs in using Wanderlust you need to download some packages.

Feel free to contribute to the project by submitting issues or pull requests. Enjoy using WanderLust!
