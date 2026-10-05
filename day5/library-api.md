# Library Books REST API Specification

This document details the complete RESTful API design for managing book resources in the library management system.

---

## 1. API Endpoints

### Endpoint 1: List All Books
* **HTTP Method:** `GET`
* **Path:** `/api/v1/books`
* **Description:** Retrieves a list of all available books in the library collection.
* **Request Body:** None required.
* **Success Code:** `200 OK`

### Endpoint 2: List Books by Author
* **HTTP Method:** `GET`
* **Path:** `/api/v1/books?author={authorName}`
* **Description:** Retrieves all books written by a specific author using a query parameter.
* **Request Body:** None required.
* **Success Code:** `200 OK`

### Endpoint 3: Get a Single Book
* **HTTP Method:** `GET`
* **Path:** `/api/v1/books/{id}`
* **Description:** Retrieves detailed information for a single book identified by its unique ID.
* **Request Body:** None required.
* **Success Code:** `200 OK`

### Endpoint 4: Create a New Book
* **HTTP Method:** `POST`
* **Path:** `/api/v1/books`
* **Description:** Adds a new book entry to the library.
* **Request Body Example:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "publishedYear": 2008
  }
Success Code: 201 Created

### Endpoint 5: Update an Existing Book
HTTP Method: PUT

Path: /api/v1/books/{id}

Description: Updates all details of an existing book record identified by its unique ID.

Request Body Example:

    ``JSON
    {
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
  "publishedYear": 2008
}
Success Code: 200 OK

### Endpoint 6: Delete a Book
HTTP Method: DELETE

Path: /api/v1/books/{id}

Description: Permanently removes a book record from the library by its unique ID.

Request Body: None required.

Success Code: 204 No Content

2. Error Codes and Examples
Status Code 400 Bad Request
When it occurs: Triggered when the request payload is malformed or missing mandatory fields (e.g., submitting a POST or PUT request without providing the required title property).

Example Error Response:

JSON
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed: 'title' field is required."
}
Status Code 404 Not Found
When it occurs: Triggered when requesting, updating, or deleting a resource ID that does not exist in the database (e.g., calling GET /api/v1/books/99999 when ID 99999 does not exist).

Example Error Response:

JSON
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Book with ID '99999' was not found."
}