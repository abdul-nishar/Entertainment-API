# MovieStore-API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MovieStore-API is a RESTful API for managing movies, user watchlists, and reviews. It supports CRUD operations for movies and allows users to create and manage their watchlists and reviews.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- User authentication and authorization
- CRUD operations for movies
- User-specific watchlists
- User-specific reviews
- Secure handling of user passwords and JWT tokens

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment variables

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/abdul-nishar/MovieStore-API.git
    cd MovieStore-API
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    NODE_ENV=development
    PORT=3000
    DATABASE=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRY_TIME=1800
    JWT_COOKIE_EXPIRY_TIME=1800
    ```

4. Start the server:
    ```bash
    npm start
    ```

## Environment Variables

- `NODE_ENV`: The environment in which the application is running (e.g., development, production).
- `PORT`: The port on which the server will run.
- `DATABASE`: The MongoDB connection string.
- `JWT_SECRET`: The secret key for signing JWT tokens.
- `JWT_EXPIRY_TIME`: The expiry time for JWT tokens (in seconds).
- `JWT_COOKIE_EXPIRY_TIME`: The expiry time for JWT cookies (in seconds).

## Usage

1. To run the server in development mode:
    ```bash
    npm run dev
    ```

2. To run the server in production mode:
    ```bash
    npm start
    ```

## API Endpoints

### Authentication

- **POST /api/v1/users/signup**: Sign up a new user
- **POST /api/v1/users/login**: Log in an existing user
- **GET /api/v1/users/logout**: Log out the current user

### Movies

- **GET /api/v1/movies**: Get all movies
- **POST /api/v1/movies**: Create a new movie (Admin)
- **GET /api/v1/movies/:id**: Get a specific movie by ID
- **PATCH /api/v1/movies/:id**: Update a specific movie by ID (Admin)
- **DELETE /api/v1/movies/:id**: Delete a specific movie by ID (Admin)

### Watchlist

- **GET /api/v1/watchlist**: Get the current user's watchlist
- **POST /api/v1/watchlist**: Add an item to the current user's watchlist
- **DELETE /api/v1/watchlist/:id**: Remove an item from the current user's watchlist

### Reviews

- **GET /api/v1/reviews**: Get all reviews
- **POST /api/v1/reviews**: Create a new review
- **GET /api/v1/reviews/:id**: Get a specific review by ID
- **PATCH /api/v1/reviews/:id**: Update a specific review by ID
- **DELETE /api/v1/reviews/:id**: Delete a specific review by ID

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines first.

## Contact

If you have any questions or suggestions, feel free to reach out to me at [sheikhabdul285@gmail.com](mailto:sheikhabdul285@gmail.com).
