# Login App

A minimal Node.js Express application.

## Project Structure

```
Login/
├── src/
│   ├── app.js       # Configures Express and defines routes
│   └── server.js    # Starts the server on port 3000
├── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Start the server**

```bash
npm start
```

The server will start at `http://localhost:3000`.

## Available Endpoints

| Method | Path      | Description          | Response              |
|--------|-----------|----------------------|-----------------------|
| GET    | /health   | Health check         | `{ "status": "ok" }` |

### Example

```bash
curl http://localhost:3000/health
# { "status": "ok" }
```
