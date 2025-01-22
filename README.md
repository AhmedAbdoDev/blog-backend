
# Blog Backend (Node.js + MongoDB)

A backend API for managing blog posts and comments, built using **Node.js**, **Express**, and **MongoDB**. The API supports user registration, post creation, and comments, while ensuring proper validation for data integrity.

## Features

- User registration with unique username and email validation.
- Add blog posts for specific users.
- Add comments to posts.
- Secure password handling with hashing.
- Validation for email format and unique usernames/emails.
- Query posts and comments for a user.

## Endpoints

### 1. **Create a New User**
- **POST** `/users`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "64fbb680aef4c9c2c70b2e45",
      "username": "john_doe"
    }
  }
  ```

### 2. **Add a Post**
- **POST** `/users/:userId/posts`
- **Description**: Add a post to a specific user.
- **Request Body**:
  ```json
  {
    "title": "My First Post",
    "content": "This is the content of the post."
  }
  ```
- **Response**:
  ```json
  {
    "message": "Post added successfully",
    "user": {
      "username": "john_doe",
      "posts": [ ... ]
    }
  }
  ```

### 3. **Add a Comment to a Post**
- **POST** `/users/:userId/posts/:postId/comments`
- **Description**: Add a comment to a specific post.
- **Request Body**:
  ```json
  {
    "user": "jane_doe",
    "content": "This is a great post!"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Comment added successfully",
    "user": { ... }
  }
  ```

### 4. **Get All Posts**
- **GET** `/users/:userId/posts`
- **Description**: Retrieve all posts of a specific user.
- **Response**:
  ```json
  {
    "username": "john_doe",
    "posts": [
      {
        "title": "My First Post",
        "content": "This is the content of the post.",
        "comments": [ ... ]
      }
    ]
  }
  ```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AhmedAbdoDev/blog-backend.git
   cd blog-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in a `.env` file:
   ```
   mongoose=your_mongo_database_uri
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```


## Technologies Used

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **bcryptjs** (for password hashing)
