# app job list


## Requirements

- [Git](https://www.odoo.com/documentation/15.0/contributing/documentation.html#install-git)
- [Node JS >= 14+](https://nodejs.org/en/blog/release/v14.17.4/)
- [MongoDb Driver](https://www.mongodb.com/docs)
- [MongoDb Server](https://hub.docker.com/_/mongo/).
- [ExpressJS](https://expressjs.com/en/4x/api.html)
- [Redis](https://redis.io/docs/)
- [JWT Token](https://jwt.io/introduction)
- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Ajv and AJv Plugins](https://ajv.js.org/guide/getting-started.html)
- [Uuid](https://github.com/uuidjs/uuid)
- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Winston]https://www.npmjs.com/package/winston)
- [Postman](https://learning.postman.com/docs/getting-started/introduction/)


## Settings & Configuring

### App config


Please check the file `env.example` and change to `.env`
there are 2 `.env` files, and both are required.
- one in [root](../../app-job-list/.env-example) folder to define server needs
- one in [backend](./.env-example) to setup the API


```env
NODE_ENV            = development
APP_PORT            = 3000
APP_ISSUER          = gitbub.com/mrbontor
....

```

### Database config

This mini microservice is developed using Docker and Docker Compose,
Hint:

    - If you are going to use your existing MongoDb and Redis, please change the configuration in [.env](../../app-job-list/.env-example) and [backend](./.env-example) (i expects the env files has been renamed)
    - If you are using MongoAtlas or other Mongo Cloud, please set variable `MONGO_LOCAL` to be true in [backend](./.env-example)


## Deployment && Testing

#### Deployment BE


Running service using `Docker` and `Docker-Compose`

```sh
# start
$ docker-compose up

# stop
$ docker-compose down

# remove
$ docker-compose down -v

#login to the container by container name base on docker-compose.yml
$ docker exec -it [`container-name`] sh

#logging the container
$ docker logs -f `container-name`
```

Running for existing MongoDB and Redis

```sh
# enter to the backend
$ cd apps/backend

# install dependencies
$ npm install

# run app
$ npm start

# or
$ node index.js
```

#### Deployment FE

on progress..


## BE Endpoints

* [AUTH](#auth)
    1. [LOGIN](#1-login)
        * [Success](#i-example-request-success)
        * [Un Authorized / wrong credential](#ii-example-request-un-authorized--wrong-credential)
    1. [SIGNUP](#2-signup)
        * [Success](#i-example-request-success-1)
        * [Err Username exist](#ii-example-request-err-username-exist)
        * [Err Email exist](#iii-example-request-err-email-exist)
        * [Err Valiation missing field](#iv-example-request-err-valiation-missing-field)
        * [Err Validation additional field](#v-example-request-err-validation-additional-field)
        * [Err UnAuthorized](#vi-example-request-err-unauthorized)
    1. [REFRESH](#3-refresh)
        * [Success](#i-example-request-success-2)
        * [err UnAuthorized](#ii-example-request-err-unauthorized)
    1. [LOGOUT](#4-logout)
        * [Sucesss](#i-example-request-sucesss)
        * [Un Authorized](#ii-example-request-un-authorized)
* [USER](#user)
    1. [CREATE](#1-create)
        * [Success](#i-example-request-success-3)
        * [Err Username exist](#ii-example-request-err-username-exist-1)
        * [Err Email exist](#iii-example-request-err-email-exist-1)
        * [Err Valiation missing field](#iv-example-request-err-valiation-missing-field-1)
        * [Err Validation additional field](#v-example-request-err-validation-additional-field-1)
        * [Err UnAuthorized](#vi-example-request-err-unauthorized-1)
    1. [UPDATE CREDENTIAL](#2-update-credential)
        * [Success](#i-example-request-success-4)
        * [Err Incorrect pwd](#ii-example-request-err-incorrect-pwd)
        * [Un Authorized, password has changed](#iii-example-request-un-authorized-password-has-changed)
    1. [GET ALL](#3-get-all)
        * [Success with filter](#i-example-request-success-with-filter)
        * [Success without filter](#ii-example-request-success-without-filter)
        * [Un Authorized](#iii-example-request-un-authorized)
    1. [GET TABLE](#4-get-table)
        * [Success](#i-example-request-success-5)
        * [Success with filter user](#ii-example-request-success-with-filter-user)
        * [Success with sort](#iii-example-request-success-with-sort)
        * [Un Authorized](#iv-example-request-un-authorized)
    1. [GET ONE](#5-get-one)
        * [Success](#i-example-request-success-6)
        * [Err not found](#ii-example-request-err-not-found)
        * [Un Authorized](#iii-example-request-un-authorized-1)
    1. [PUT](#6-put)
        * [Success](#i-example-request-success-7)
        * [Err Validation additional field(s)](#ii-example-request-err-validation-additional-fields)
        * [Err Not found](#iii-example-request-err-not-found)
        * [Err email exist](#iv-example-request-err-email-exist)
        * [Un Authorized](#v-example-request-un-authorized)
    1. [DELETE](#7-delete)
        * [Success](#i-example-request-success-8)
        * [Un Authorized](#ii-example-request-un-authorized-1)
* [JOB](#job)
    1. [JOBS Pagination](#1-jobs-pagination)
        * [Success withoout filter](#i-example-request-success-withoout-filter)
        * [Succces with filter](#ii-example-request-succces-with-filter)
        * [No Available data](#iii-example-request-no-available-data)
        * [JOBS Pagination](#iv-example-request-jobs-pagination)
    1. [JOB DETAIL](#2-job-detail)
        * [Success](#i-example-request-success-9)
        * [Err UnAuthorized](#ii-example-request-err-unauthorized-1)
* [Ungrouped](#ungrouped)
    1. [HEALTH CHECK](#1-health-check)
        * [HEALTH CHECK](#i-example-request-health-check)

--------



## AUTH

User(s) must be _authenticated_ before accessing any API.

  
The `AUTH API` will return `accessToken`, `refreshToken` and `DID`  
`API` has provided `Cookies` for clients with `expiration time`.  
To change the `lifetime`, look in the `.env` file. Expiration time is used to handle `JWT Token` and `Cookie` expiration

Notes:

- `accessToken` will be returned in response body
- `refreshToken` will be returned as `Cookie` with name `RTOKEN`
- `deviceId` is the _**device identifier**_ and will be returned as a `Cookie` with name `DID`



### 1. LOGIN


User login using method POST with paramaters`username` and `password.`


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{local}}/v1/auth/login
```



***Body:***

```js        
{
    "emailAddress": "superadmin@gmail.com",
    "password": "Superadmin123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "emailAddress": "superadmin@gmail.com",
    "password": "Superadmin123!"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsQWRkcmVzcyI6InN1cGVyYWRtaW5AZ21haWwuY29tIn0sImlhdCI6MTY3NjMxNzg0NywiZXhwIjoxNjc2MzUzODUwLCJhdWQiOiJnaXRidWIuY29tL21yYm9udG9yIiwiaXNzIjoiZ2l0YnViLmNvbS9tcmJvbnRvciJ9._YH23frdqyVqenHCU0y5uOs-1y2hMKeWfa4RxRsAVTU"
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Un Authorized / wrong credential



***Body:***

```js        
{
    "emailAddress": "superadmin@gmail.com",
    "password": "Superadmin123!!"
}
```



#### II. Example Response: Un Authorized / wrong credential
```js
{
    "status": false,
    "message": "Un Authorized!"
}
```


***Status Code:*** 401

<br>



### 2. SIGNUP


Register user use `JSON` payload to create a user


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{local}}/v1/auth/register
```



***Body:***

```js        
{
    "firstName": "user",
    "lastName": "baru",
    "gender": "Man",
    "userName": "user1",
    "emailAddress": "user1@gmail.com",
    "password": "User123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": "63ea87cef26e1fd489b65dfe"
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err Username exist



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### II. Example Response: Err Username exist
```js
{
    "status": false,
    "message": "The userName has been registered!"
}
```


***Status Code:*** 422

<br>



#### III. Example Request: Err Email exist



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin1",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### III. Example Response: Err Email exist
```js
{
    "status": false,
    "message": "The emailAddress has been registered!"
}
```


***Status Code:*** 422

<br>



#### IV. Example Request: Err Valiation missing field



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### IV. Example Response: Err Valiation missing field
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "gender",
            "key": "required",
            "message": "Gender is required!"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### V. Example Request: Err Validation additional field



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!",
    "xxx": "xxx"
}
```



#### V. Example Response: Err Validation additional field
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "xxx",
            "key": "additionalProperties",
            "message": "must NOT have additional properties"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### VI. Example Request: Err UnAuthorized



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### VI. Example Response: Err UnAuthorized
```js
{
    "status": false,
    "message": "Token invalid"
}
```


***Status Code:*** 401

<br>



### 3. REFRESH


Fetch new Token as a refresh token


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/auth/refresh-token
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJOYW1lIjoic3VwZXJhZG1pbiIsImVtYWlsQWRkcmVzcyI6InN1cGVyYWRtaW5AZ21haWwuY29tIn0sImlhdCI6MTY3NjMxOTA1MiwiZXhwIjoxNjc2MzU1MDU1LCJhdWQiOiJnaXRidWIuY29tL21yYm9udG9yIiwiaXNzIjoiZ2l0YnViLmNvbS9tcmJvbnRvciJ9.xLYDBHw7wpYYSWYy5Nnyhp6Wxk0LD9YnNmfdnnlmY0A"
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: err UnAuthorized



***Body: None***



#### II. Example Response: err UnAuthorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 4. LOGOUT


User Logout and remove token, cookies etc


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/auth/logout
```



***More example Requests/Responses:***


#### I. Example Request: Sucesss



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| allDevices | true | true or false |



***Body: None***



***Status Code:*** 204

<br>



#### II. Example Request: Un Authorized



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| allDevices | true | true or false |



***Body: None***



#### II. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



## USER

`Users` directory contains all the user related APIs. For authentication these apis requrie `AuthBearerToken`



### 1. CREATE


Create user use `JSON` payload to create a user


***Endpoint:***

```bash
Method: POST
Type: RAW
URL: {{local}}/v1/users
```



***Body:***

```js        
{
    "firstName": "user",
    "lastName": "baru",
    "gender": "Man",
    "userName": "user1",
    "emailAddress": "user1@gmail.com",
    "password": "User123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": "63ea87cef26e1fd489b65dfe"
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err Username exist



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### II. Example Response: Err Username exist
```js
{
    "status": false,
    "message": "The userName has been registered!"
}
```


***Status Code:*** 422

<br>



#### III. Example Request: Err Email exist



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin1",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### III. Example Response: Err Email exist
```js
{
    "status": false,
    "message": "The emailAddress has been registered!"
}
```


***Status Code:*** 422

<br>



#### IV. Example Request: Err Valiation missing field



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### IV. Example Response: Err Valiation missing field
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "gender",
            "key": "required",
            "message": "Gender is required!"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### V. Example Request: Err Validation additional field



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!",
    "xxx": "xxx"
}
```



#### V. Example Response: Err Validation additional field
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "xxx",
            "key": "additionalProperties",
            "message": "must NOT have additional properties"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### VI. Example Request: Err UnAuthorized



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### VI. Example Response: Err UnAuthorized
```js
{
    "status": false,
    "message": "Token invalid"
}
```


***Status Code:*** 401

<br>



### 2. UPDATE CREDENTIAL


`Patch` password user use `JSON` payload to update user password.

fields:

- password, _`required`_
- newPassword, _`required`_
    

Noted: Changing password will remove Token Bearer


***Endpoint:***

```bash
Method: PATCH
Type: RAW
URL: {{local}}/v1/users/password/superadmin
```



***Body:***

```js        
{
    "password": "SuperAdmin123!",
    "newPassword": "Superadmin123!"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "password": "SuperAdmin123!",
    "newPassword": "Superadmin123!"
}
```



***Status Code:*** 204

<br>



#### II. Example Request: Err Incorrect pwd



***Body:***

```js        
{
    "password": "Superadmin123!!",
    "newPassword": "Superadmin123!"
}
```



#### II. Example Response: Err Incorrect pwd
```js
{
    "status": false,
    "message": "Incorect Password"
}
```


***Status Code:*** 400

<br>



#### III. Example Request: Un Authorized, password has changed



***Body:***

```js        
{
    "password": "!Haruslolos123",
    "newPassword": "Haruslolos123!"
}
```



#### III. Example Response: Un Authorized, password has changed
```js
Unauthorized
```


***Status Code:*** 401

<br>



### 3. GET ALL


Fetch all list users


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/users
```



***More example Requests/Responses:***


#### I. Example Request: Success with filter



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| userName | user |  |



***Body: None***



#### I. Example Response: Success with filter
```js
{
    "status": true,
    "message": "Success",
    "data": [
        {
            "firstName": "user",
            "lastName": "baru",
            "gender": "Man",
            "userName": "user",
            "emailAddress": "user@gmail.com",
            "infoLogin": {
                "hash": "ca2658da7607e51c90f34c40673e90703f3fd166325bb93e7af42996602a908ad9001549d89e19680cd57ccabc63f5ff175e79602ca70686b230750df11a132a",
                "salt": "9QivnIANDqJZlrX6tknuotPULAiX+sS4eiOUsO+ODAU=",
                "iterations": 13786
            },
            "createdAt": "2023-02-13T19:29:30.069Z",
            "updatedAt": "2023-02-13T19:29:30.069Z",
            "_id": "63ea8f9a33fc7d066c2a1c60"
        }
    ]
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Success without filter



***Body: None***



#### II. Example Response: Success without filter
```js
{
    "status": true,
    "message": "Success",
    "data": [
        {
            "firstName": "user",
            "lastName": "baru",
            "gender": "Man",
            "userName": "user",
            "emailAddress": "user@gmail.com",
            "infoLogin": {
                "hash": "ca2658da7607e51c90f34c40673e90703f3fd166325bb93e7af42996602a908ad9001549d89e19680cd57ccabc63f5ff175e79602ca70686b230750df11a132a",
                "salt": "9QivnIANDqJZlrX6tknuotPULAiX+sS4eiOUsO+ODAU=",
                "iterations": 13786
            },
            "createdAt": "2023-02-13T19:29:30.069Z",
            "updatedAt": "2023-02-13T19:29:30.069Z",
            "_id": "63ea8f9a33fc7d066c2a1c60"
        },
        {
            "_id": "63ea8edeb1c4594d460bf06a",
            "firstName": "Super",
            "lastName": "Admins",
            "gender": "Man",
            "userName": "superadmin",
            "emailAddress": "superadmin@gmail.com",
            "infoLogin": {
                "hash": "0c3d37e8400d491340aaebcbd61d03dbcc633ab5bc2a68db5c9a89405a61d5e1ea27305be13d1e816feb5909aa05d8950e22e7fccfdced84f484d6183d7c9153",
                "salt": "0HsD05G4VWBiHbddEo9MaDqvQSekNCIaUdaDmjtc/R0=",
                "iterations": 25475
            },
            "createdAt": "2023-02-13T19:28:27.894Z",
            "updatedAt": "2023-02-13T19:28:27.894Z"
        }
    ]
}
```


***Status Code:*** 200

<br>



#### III. Example Request: Un Authorized


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body: None***



#### III. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 4. GET TABLE


Fetch `User` using pagination

allowed filter/search by multiple fields

- firstName
- username
- email
    

can be sorted by those fields as well

`sortBy` = status

`sortType` = `desc` or `asc`


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/users/table
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "sort": {
            "updatedAt": "ASC"
        },
        "page": 1,
        "size": 10,
        "totalRecord": 2,
        "totalPage": 1,
        "data": [
            {
                "_id": "63df5fb20a6799aeaf22f724",
                "userName": "superadmin",
                "accountNumber": 12345671,
                "emailAddress": "superadmin@gmail.com",
                "identityNumber": 1234567898765431,
                "createdAt": "2023-02-05T07:50:10.417Z",
                "updatedAt": "2023-02-05T07:50:10.417Z"
            },
            {
                "_id": "63df60c87116dd7ec619891b",
                "userName": "user",
                "accountNumber": 12345672,
                "emailAddress": "user@gmail.com",
                "identityNumber": 1234567898765432,
                "createdAt": "2023-02-05T07:54:48.310Z",
                "updatedAt": "2023-02-05T07:54:48.310Z"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Success with filter user



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| sortBy | status | userName, emailAddress, identityNumber, accountNumber  |
| sortType | desc | asc, desc and/or  0, 1 |
| search | superadmin | string |



***Body: None***



#### II. Example Response: Success with filter user
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "sort": {
            "status": "DESC"
        },
        "page": 1,
        "size": 10,
        "totalRecord": 2,
        "totalPage": 1,
        "data": [
            {
                "_id": "63df5fb20a6799aeaf22f724",
                "userName": "superadmin",
                "accountNumber": 12345671,
                "emailAddress": "superadmin@gmail.com",
                "identityNumber": 1234567898765431,
                "createdAt": "2023-02-05T07:50:10.417Z",
                "updatedAt": "2023-02-05T07:50:10.417Z"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### III. Example Request: Success with sort



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| sortBy | status | firstName, username, email, status |
| sortType | desc | asc, desc and/or  0, 1 |



***Body: None***



#### III. Example Response: Success with sort
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "sort": {
            "status": "DESC"
        },
        "page": 1,
        "size": 10,
        "totalRecord": 2,
        "totalPage": 1,
        "data": [
            {
                "_id": "63df5fb20a6799aeaf22f724",
                "userName": "superadmin",
                "accountNumber": 12345671,
                "emailAddress": "superadmin@gmail.com",
                "identityNumber": 1234567898765431,
                "createdAt": "2023-02-05T07:50:10.417Z",
                "updatedAt": "2023-02-05T07:50:10.417Z"
            },
            {
                "_id": "63df60c87116dd7ec619891b",
                "userName": "user",
                "accountNumber": 12345672,
                "emailAddress": "user@gmail.com",
                "identityNumber": 1234567898765432,
                "createdAt": "2023-02-05T07:54:48.310Z",
                "updatedAt": "2023-02-05T07:54:48.310Z"
            }
        ]
    }
}
```


***Status Code:*** 200

<br>



#### IV. Example Request: Un Authorized


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body: None***



#### IV. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 5. GET ONE


Fetch a single user using `identityNumber`


***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/users/users
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "firstName": "user",
        "lastName": "baru",
        "gender": "Man",
        "userName": "user",
        "emailAddress": "user@gmail.com",
        "infoLogin": {
            "hash": "ca2658da7607e51c90f34c40673e90703f3fd166325bb93e7af42996602a908ad9001549d89e19680cd57ccabc63f5ff175e79602ca70686b230750df11a132a",
            "salt": "9QivnIANDqJZlrX6tknuotPULAiX+sS4eiOUsO+ODAU=",
            "iterations": 13786
        },
        "createdAt": "2023-02-13T19:29:30.069Z",
        "updatedAt": "2023-02-13T19:29:30.069Z",
        "_id": "63ea8f9a33fc7d066c2a1c60"
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err not found



***Body: None***



#### II. Example Response: Err not found
```js
{
    "status": false,
    "message": "User not found!"
}
```


***Status Code:*** 404

<br>



#### III. Example Request: Un Authorized


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body: None***



#### III. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 6. PUT


Update user use `JSON` payload to update a user


***Endpoint:***

```bash
Method: PUT
Type: RAW
URL: {{local}}/v1/users/superadmin
```



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admins",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "user@gmail.com"
}
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admins",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com"
}
```



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "_id": "63ea8edeb1c4594d460bf06a",
        "firstName": "Super",
        "lastName": "Admins",
        "gender": "Man",
        "userName": "superadmin",
        "emailAddress": "superadmin@gmail.com",
        "infoLogin": {
            "hash": "0c3d37e8400d491340aaebcbd61d03dbcc633ab5bc2a68db5c9a89405a61d5e1ea27305be13d1e816feb5909aa05d8950e22e7fccfdced84f484d6183d7c9153",
            "salt": "0HsD05G4VWBiHbddEo9MaDqvQSekNCIaUdaDmjtc/R0=",
            "iterations": 25475
        },
        "createdAt": "2023-02-13T19:28:27.894Z",
        "updatedAt": "2023-02-13T19:28:27.894Z"
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err Validation additional field(s)



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### II. Example Response: Err Validation additional field(s)
```js
{
    "status": false,
    "message": "Validation Error!",
    "errors": [
        {
            "param": "password",
            "key": "additionalProperties",
            "message": "must NOT have additional properties"
        }
    ]
}
```


***Status Code:*** 400

<br>



#### III. Example Request: Err Not found



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com"
}
```



#### III. Example Response: Err Not found
```js
{
    "status": false,
    "message": "User not found!"
}
```


***Status Code:*** 404

<br>



#### IV. Example Request: Err email exist



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admins",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "user@gmail.com"
}
```



#### IV. Example Response: Err email exist
```js
{
    "status": false,
    "message": "The emailAddress has been registered!"
}
```


***Status Code:*** 422

<br>



#### V. Example Request: Un Authorized


***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json |  |



***Body:***

```js        
{
    "firstName": "Super",
    "lastName": "Admin",
    "gender": "Man",
    "userName": "superadmin",
    "emailAddress": "superadmin@gmail.com",
    "password": "SuperAdmin123!"
}
```



#### V. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 7. DELETE


Delete a single user using `idUser`

Only Admin can perform this API


***Endpoint:***

```bash
Method: DELETE
Type: 
URL: {{local}}/v1/users/user1
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



***Status Code:*** 204

<br>



#### II. Example Request: Un Authorized



***Body: None***



#### II. Example Response: Un Authorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



## JOB



### 1. JOBS Pagination



***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/jobs
```



***More example Requests/Responses:***


#### I. Example Request: Success withoout filter



***Body: None***



#### I. Example Response: Success withoout filter
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "data": [
            
            {
                "id": "32bf67e5-4971-47ce-985c-44b6b3860cdb",
                "type": "Full Time",
                "url": "https://jobs.github.com/positions/32bf67e5-4971-47ce-985c-44b6b3860cdb",
                "created_at": "Wed May 19 00:49:17 UTC 2021",
                "company": "SweetRush",
                "company_url": "https://www.sweetrush.com/",
                "location": "Remote",
                "title": "Senior Creative Front End Web Developer",
                "description": "description",
                "how_to_apply": "<p>If this describes your interests and experience, please submit your current resume and salary requirements through the following link:\n<a href=\"https://www.sweetrush.com/join-us/\">https://www.sweetrush.com/join-us/</a></p>\n",
                "company_logo": "https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaUtqIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--82886ff47e94ff4c0255b95773a9667644768b2b/SR%20Logo.png"
            },
        ],
        "page": 1,
        "size": 10
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Succces with filter



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| location | Schwerin |  |



***Body: None***



#### II. Example Response: Succces with filter
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "data": [
            {
                "id": "7638eee4-4e75-4c06-a920-ea7619a311b5",
                "type": "Full Time",
                "url": "https://jobs.github.com/positions/7638eee4-4e75-4c06-a920-ea7619a311b5",
                "created_at": "Tue May 18 17:12:52 UTC 2021",
                "company": "MANDARIN MEDIEN Gesellschaft für digitale Lösungen mbH",
                "company_url": "https://www.mandarin-medien.de/",
                "location": "Schwerin",
                "title": "Systemadministrator:in",
                "description": "description ex",
                "how_to_apply": "<p><a href=\"https://t.gohiring.com/h/83f7df34249addb0bebc8dc680310d1ded43220a748ee285e27989a457dd10ea\">Application form</a></p>\n",
                "company_logo": "https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaCtqIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--8d0339b9e43b0dca160b9db73b230b6067e39b05/MANDARIN%20MEDIEN%20Gesellschaft%20fu%CC%88r%20digitale%20Lo%CC%88sungen%20mbH.jpeg"
            },
            ...
        ],
        "page": 1,
        "size": 3
    }
}
```


***Status Code:*** 200

<br>



#### III. Example Request: No Available data



***Query:***

| Key | Value | Description |
| --- | ------|-------------|
| page | 3 |  |



***Body: None***



#### III. Example Response: No Available data
```js
{
    "status": false,
    "message": "No data available"
}
```


***Status Code:*** 404

<br>



#### IV. Example Request: JOBS Pagination



***Body: None***



#### IV. Example Response: JOBS Pagination
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



### 2. JOB DETAIL



***Endpoint:***

```bash
Method: GET
Type: 
URL: {{local}}/v1/jobs/0cbbfe2b-5dcf-45f9-94bf-b74882b593ff
```



***More example Requests/Responses:***


#### I. Example Request: Success



***Body: None***



#### I. Example Response: Success
```js
{
    "status": true,
    "message": "Success",
    "data": {
        "id": "0cbbfe2b-5dcf-45f9-94bf-b74882b593ff",
        "type": "Full Time",
        "url": "https://jobs.github.com/positions/0cbbfe2b-5dcf-45f9-94bf-b74882b593ff",
        "created_at": "Fri May 14 08:12:18 UTC 2021",
        "company": "Bertrandt Technikum GmbH Ehningen",
        "company_url": "http:",
        "location": "Ehningen",
        "title": "Entwicklungsingenieur (m/w/d) AUTOSAR",
        "description": "exem descript",
        "how_to_apply": "<p><a href=\"https://bertrandtgroup.jobbase.io/apply/krjxavmlljhlwvli7c0r4burof6gt1j\">https://bertrandtgroup.jobbase.io/apply/krjxavmlljhlwvli7c0r4burof6gt1j</a></p>\n",
        "company_logo": null
    }
}
```


***Status Code:*** 200

<br>



#### II. Example Request: Err UnAuthorized



***Body: None***



#### II. Example Response: Err UnAuthorized
```js
{
    "status": false,
    "message": "Token Invalid"
}
```


***Status Code:*** 401

<br>



## Ungrouped



### 1. HEALTH CHECK


To ensure this service online, the client can request to this API first than continue main API


***Endpoint:***

```bash
Method: GET
Type: 
URL: localhost:3002
```



***More example Requests/Responses:***


#### I. Example Request: HEALTH CHECK



***Body: None***



#### I. Example Response: HEALTH CHECK
```js
{
    "uptime": 119.348257728,
    "message": "OK",
    "timestamp": 1676317218443
}
```


***Status Code:*** 200

<br>



---
[Back to top](#app-job-list)