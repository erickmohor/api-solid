# Project
Project made using NodeJs applying SOLID principles. Unit and end-to-end tests were also done.


## Tech Stack
**Server:** Node, Fastify

**DevOps:** Docker

**Database:** PostgreSQL

**Tests:** Vitest


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`
`JWT_SECRET`
`DATABASE_URL`


## Run Locally

Clone the project

```bash
  git clone
```

Go to the project directory

```bash
  cd api-solid
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

## Running Tests

To run tests, run the following command

### Unit Tests

```bash
  npm run test
```

### E2E Tests

```bash
  npm run test:e2e
```