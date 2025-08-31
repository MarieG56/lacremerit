# La Crème Rit Stock Manager

La Crème Rit Stock Manager is an application designed to manage stock inventories. The project consists of a back-end built with NestJS and a front-end built with React. It offers user authentication using JWT (with refresh tokens) and provides functionalities for managing products, clients, producers, inventory, history, and orders.

## Table of Contents

- [Features](#features)
- [Architecture & Technologies](#architecture--technologies)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Back-End Setup](#back-end-setup)
  - [Front-End Setup](#front-end-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Stock Management**: Features include routes and interfaces for managing products, clients, producers, inventories, order histories, and orders.
- **Responsive UI**: Separate header components for mobile and desktop views ensure a seamless user experience.
- **Input Validation**: Uses NestJS ValidationPipe on the back-end to validate incoming data.
- **User Authentication**: Secure login using JWT with access tokens.

## Architecture & Technologies

### Back-End

- **Framework**: NestJS
- **Language**: TypeScript
- **Authentication**: JWT with refresh tokens
- **Database**: PostgreSQL (using Supabase for connection pooling and direct connection for migrations)
- **Libraries**:
  - [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
  - [cookie-parser](https://www.npmjs.com/package/cookie-parser) for parsing cookies
- **Key Files**:
  - `src/auth/auth.controller.ts` – Implements endpoints for login and token refresh. The refresh token is configured with a 7-day expiration.
  - `src/auth/auth.service.ts` – Contains the logic for user validation, token generation, and token refresh.

### Front-End

- **Framework**: React
- **Language**: TypeScript
- **Routing**: React Router
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios (configured with `withCredentials: true` to send cookies)
- **User Interface**: Components for login, headers (mobile and desktop), and various pages (Home, Products, Clients, Producers, Inventory, History, Orders).

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (preferably the LTS version)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- PostgreSQL database (or access to Supabase)

### Environment Configuration

Create a `.env` file in the back-end directory with at least the following variables:

```properties
# .env (back-end)
DATABASE_URL="postgresql://username:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://username:password@host:5432/database"
JWT_SECRET="your_jwt_secret"
```

Adjust these values to suit your specific configuration.

### Back-End Setup

1. Navigate to your back-end folder:
   ```bash
   cd lacremerit-stock-manager-back
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the NestJS server:
   ```bash
   npm run start
   ```

### Front-End Setup

1. Navigate to your front-end folder:
   ```bash
   cd lacremerit-stock-manager-front
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the React application in development mode:
   ```bash
   npm run start
   ```

Ensure that the front-end is configured to send credentials (e.g., via `withCredentials: true` in Axios) so that the cookies are correctly handled.

## Running the Application

- **Back-End**: The server will run on the port specified in your environment (default is 3000).
- **Front-End**: The React app typically runs on port 3000 or another port if configured differently.

## Testing

### Back-End Testing

Run the following command in the back-end folder to execute unit tests (if configured):

```bash
npm run test
```

### Front-End Testing

Run tests for the front-end by executing:

```bash
npm run test
```

## Deployment

- **Back-End**: Consider deploying your back-end to platforms like Heroku, Vercel (using serverless functions), or any other Node.js hosting provider. Ensure that environment variables and CORS configurations are properly set.
- **Front-End**: You can deploy the React application on Vercel, Netlify, or any static hosting provider.

## Contributing

Contributions are welcome!  
If you have suggestions, improvements, or find issues, please open an issue or submit a pull request on [GitHub](https://github.com/your-username/your-repository).

## License

This project is licensed under the [MIT License](LICENSE).
