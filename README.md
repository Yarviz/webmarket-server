# webmarket-server

Webmarket-server is an example RESTful API for handling user requests in an online store.

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

    NODE_ENV e.g. "development"
    PORT e.g. 3000
    TOKEN_SECRET e.g. "secret_key"
    TOKEN_EXPIRES e.g. "30m"
    APP_URL e.g. https//myapp.com (when running tests in remote server)

## Tests

### local tests

    npm test

### remote tests

    npm test -- -remote