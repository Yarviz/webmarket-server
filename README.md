# webmarket-server

Webmarket-server is an example RESTful server for handling user requests in an online store.

There is not integrated database, but created users, postings and images are saved temporarily in memory.
## Functionality
    - user creating/patching
    - login/logout
    - posting creating/patching/deleting
    - uploading/downloading posting images
    - searching postings
    - resetting data

## Installation

Need node.js and npm package manager.

    npm install
    npm start

## Enviroment variables

Need following enviromenet variables in .env file.

    NODE_ENV
    PORT
    TOKEN_SECRET
    TOKEN_EXPIRES
    APP_URL (when running tests in remote server)

## Tests

### local tests

    npm test

### remote tests

    npm test -- -remote