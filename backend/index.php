<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Entry point for the API

// Include database configuration
require_once 'config/database.php';

// Create database if it doesn't exist
$database = new Database();
$db = $database->getConnection();

try {
    $db->exec("CREATE DATABASE IF NOT EXISTS e_library");
    $db->exec("USE e_library");
    echo json_encode(["message" => "Database created or already exists."]);
} catch (PDOException $exception) {
    echo json_encode(["message" => "Database creation failed: " . $exception->getMessage()]);
}

// Define your routes and endpoints here
$request_uri = $_SERVER['REQUEST_URI'];

switch ($request_uri) {
    case '/e-library-web-app/backend/index.php':
        echo json_encode(["message" => "Welcome to the backend!"]);
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found"]);
        break;
}

// Get the request method
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Check if PATH_INFO is set
$pathInfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';

// Parse the URL
$request = explode('/', trim($pathInfo, '/'));

// Handle API requests
if (isset($request[0]) && $request[0] == 'api' && isset($request[1])) {
    switch ($request[1]) {
        case 'books':
            require 'api/books.php';
            break;
        case 'book':
            require 'api/book.php';
            break;
        case 'addBook':
            require 'api/addBook.php';
            break;
        case 'updateBook':
            require 'api/updateBook.php';
            break;
        case 'deleteBook':
            require 'api/deleteBook.php';
            break;
        default:
            echo json_encode(array("message" => "Endpoint not found"));
            break;
    }
} else {
    echo json_encode(array("message" => "Endpoint not found"));
}
?>