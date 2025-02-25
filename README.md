# Broadvoice - Challenge

## Overall architecture
The architecture of the solution is based on the following components:

- Running on a Docker container:
  - PostgreSQL database to store the users and items data;
  - Redis database to store the cache of the users;
- Running locally:
  - NestJS application to expose the REST API;

### Authentication

The implemented authentication is Basic Auth, with the use of a username and password. The username and password hash are stored in the PostgreSQL database.

Available users:

| Role    | User ID                              | Username | Password | # Items |
|---------|--------------------------------------|----------|----------|---------|
| admin   | b293d9a9-1d1a-4729-a333-ea4435620b48 | admin    | admin    | 2       |
| regular | df960bb2-2647-4b0f-937f-ac3d26780913 | alex     | alex     | 1       |
| regular | 6ec2a8d2-c75f-48d8-9a4f-2d484a4d6386 | carlos   | carlos   | 0       |

## How to run the application

### Running the Docker containers

```shell
docker compose up
```

### Running the NestJS application

Change Node.js version to current LTS version: v22.2 (requires nvm installed globally):

```shell
$ nvm use
```

Install the dependencies:

```shell
$ npm install
```

Run the REST API application:

```shell
# development
$ npm run start

# development in watch mode
$ npm run start:dev
```

## How to test the application

### Running the tests

```bash
# unit tests
$ npm run test

# unit tests in watch mode
$ npm run test:watch

# test coverage
$ npm run test:cov
```

### Using Bruno application

Bruno is a Git-integrated, fully offline, and open-source API client. (more info: https://usebruno.com/)

The collection is available in the `./bruno` folder.

## API Documentation

- GET /items - List all items
- GET /items/:id - Get an item by id
- POST /items - Create a new item
- PUT /items/:id - Update an item by id
- DELETE /items/:id - Delete an item by id


## Non-Functional Challenges Notes

Below are some notes about the non-functional challenges and how they were addressed in the solution, if marked as [x]. If not marked, it means that it was not implemented, but it is a suggestion to take into account in a production environment or in a more complex application.


**Scalability**

_How will your API handle increasing amounts of data or concurrent requests?_

- [x] Use of a connections pool to the PostgreSQL database server;
  - increased the number of connections to 25 and tested with 100.000 requests with the `ab` tool;
  `ab -c 30 -n 100000 -H "Authorization: Basic $(echo -n 'admin:admin' | base64)" http://localhost:3000/items` 
- [ ] In production environments, will use a load balancer to distribute the requests between two or more instances of the application;
- [ ] Implement an asynchronous processing mechanism to handle requests that require more time to be processed, like INSERT, UPDATE or DELETE. Example: publish a message to a message broker, like RabbitMQ, and process the message in a background worker(s);

---

**Performance**

_How will you ensure efficient query handling and response times, even with a large number of tasks?_

- [x] Use of a cache mechanism (Redis) to store the users' data for a period of time (60 seconds);
  - avoided the need to query the database for each subsequent request to the same user;
- [x] Use of indexes in the database to speed up the queries;

---

**Security**

_How will you protect the API from common vulnerabilities (e.g., SQL injection, XSS)?_

- [x] Using a well-known and tested framework (NestJS) that provides security mechanisms out-of-the-box;
- [x] Use of a database ORM (TypeORM) that provides mechanisms to prevent SQL injection;
- [ ] Implementation of a mechanism to protect the API authentication from brute force attacks;

_How will user data, including passwords, be securely managed?_

- [x] Use of a secure password hashing library (bcrypt) to store the password hash in the database;
- [x] For the sake of simplicity, the implemented authentication mechanism is Basic Auth, but for production environments, it should be replaced by a more secure mechanism, like OAuth2 or JWT;
- [ ] In production environments, use of HTTPS to encrypt the data in transit;

---

**Maintainability**

_How will you structure your code and project to ensure it is clean, modular, and easy to extend?_

- [x] Use of a well-known and tested framework (NestJS) that provides a modular and opinionated structure;
- [x] To ensure the code uniformization, use of a linter (ESLint) and a code formatter (Prettier);
- [x] Implementation of unit tests to ensure the code quality and prevent regressions;
  - [ ] Increase the test coverage to 100% (only in the necessary files);
  - [ ] Implement end-to-end tests to ensure the API works as expected;

---

**Observability**

_How will you monitor the system to track errors, performance, and usage?_

- [x] Use of a logger to track errors and debug information;
- [ ] If using a nginx server in front of the REST API, use of the access and error logs to track the requests;
- [ ] Use of third-party services to monitor the application, like New Relic (Memory Usage, Apdex Score, CPU Utilization, Web Transaction Errors, etc).
