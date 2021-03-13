# Express authentication
This is an example that show how create a authentication make with node using express, passport and mongoose. Additionally, the example has the following functionalities: registration of requests, verification of mail and a documentation of the endpoints.

# Getting Started
To install this example on your computer, clone the repository and install dependencies.
```
git clone git@github.com:jhernandezd95/express_authentication.git
cd express_authentication
npm i
```

The example work with this environment variables:
```
PORT=3000
DATABASE=mongodb://host:port/name
CLIENT_URL=CLIENT_URL

SALT_WORK_FACTOR=SALT_WORK_FACTOR

JWT_KEY=JWT_KEY
PASSWORD_EMAIL=PASSWORD_EMAIL
FORGOT_PASSWORD_KEY=FORGOT_PASSWORD_KEY
ACCOUNT_ACTIVATE_KEY=ACCOUNT_ACTIVATE_KEY
```
# Built With
* Express - Framework used for work with Node.js
* Passport - Authentication middleware for Node.js
* Mongoose - Used for connect with Mongodb
* Nodemailer - Send email
* Winston - Provides middlewares for request and error logging
* Swagger UI - Used for document the API endpoints

Open postman and try it.


