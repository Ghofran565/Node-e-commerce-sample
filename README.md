# Node.js E-commerce Sample

This repository hosts an **E-commerce API** built with Node.js, designed to manage product listings, user accounts, orders, and other e-commerce functionalities.

# Postman's workspace link
- There is no Link because no workspace has been made for this project yet

# Important

This project has been **discontinued**. The creator is no longer working on it, and it may not be continued in the future.

## Project Structure

- **Controllers**: Handles business logic for products, users, and orders.
- **Middlewares**: Manages authentication, authorization, and request validation.
- **Models**: Defines schemas and interacts with the database.
- **Routes**: Organizes API endpoints.
- **Utilities**: Reusable helper functions for error handling, configuration, and more.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ghofran565/Node-e-commerce-sample.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Node-e-commerce-sample
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file using the provided `config.env` template and configure your environment variables.
5. Start the server:
   ```bash
   npm run server
   ```

## API Endpoints Examples

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/login`    | User login               |
| GET    | `/api/products`      | Fetch all products       |
| POST   | `/api/orders`        | Create a new order       |
| GET    | `/api/orders/:id`    | Fetch order details      |

(Refer to the respective route files in the `Routes` directory for full details.)

## Development Phase

**Phase**: **Discontinued**

**Status**: This project is no longer maintained. The creator may not respond to issues or questions.

## Common Issues

- **Missing Environment Variables**: Ensure all required variables are defined in the `.env` file to prevent runtime errors.

## Contributing

Since this project is **discontinued**, contributions are not actively accepted. However, you are free to fork the repository and modify it as needed.

## License

This project is licensed under the [MIT License](LICENSE).
