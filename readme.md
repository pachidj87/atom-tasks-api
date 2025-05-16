# Atom Tasks API

Atom Tasks API is a lightweight and efficient task management API built with Express.js. It provides endpoints to create, read, update, and delete tasks.

## Features

- RESTful API for task management.
- Lightweight and easy to integrate.
- Built with Node.js and Express.js.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/pachidj87/atom-tasks-api.git
  cd atom-tasks-api
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a `.env` file in the root directory and configure the following variables:
  ```
  APP_PORT=
  APP_NAME=
  APP_ENV=

  JWT_SECRET=
  JWT_TOKEN_EXPIRY=
  JWT_REFRESH_TOKEN_EXPIRY=
  ```
4. Configure Firestore:

  Create a `service-account-key.json` file in the root directory containing your firestore configuration:
  ```json
  {
    "type": "service_account",
    "project_id": "project-id",
    "private_key_id": "private_key_id",
    "private_key": "private_key",
    "client_email": "client_email",
    "client_id": "client_id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40project-id.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  ```    

5. Start the server:
  ```bash
  npm start
  ```

## API Endpoints

### Auth

- **POST** `/auth/register` - Register a new user.
- **POST** `/auth/login` - Authenticate a user and return a token.
- **POST** `/auth/validate-email` - Validate a given email.
- **POST** `/auth/validate-token` - Validate a given token.

### Users

- **GET** `/users/:id` - Retrieve a specific user by ID.

### Tasks

- **GET** `/tasks` - Retrieve all tasks.
- **GET** `/tasks/:id` - Retrieve a specific task by ID.
- **GET** `/tasks/owner/:id` - Retrieve a specific set of tasks by its owner ID.
- **POST** `/tasks` - Create a new task.
- **PUT** `/tasks/:id` - Update a task by ID.
- **DELETE** `/tasks/:id` - Delete a task by ID.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries, please contact [pachidj87@gmail.com].
