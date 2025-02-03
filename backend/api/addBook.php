<?php
require_once '../config/database.php';

// Set more permissive CORS headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    // Get and log raw input
    $rawData = file_get_contents("php://input");
    error_log("Raw input: " . $rawData);
    
    $data = json_decode($rawData);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON decode error: " . json_last_error_msg());
    }

    // Debug log
    error_log("Decoded data: " . print_r($data, true));

    // Validate all required fields with detailed messages
    if (!isset($data->title) || empty(trim($data->title))) {
        throw new Exception("Title is required and cannot be empty");
    }
    if (!isset($data->author) || empty(trim($data->author))) {
        throw new Exception("Author is required and cannot be empty");
    }
    if (!isset($data->description) || empty(trim($data->description))) {
        throw new Exception("Description is required and cannot be empty");
    }
    if (!isset($data->pdf_url) || empty(trim($data->pdf_url))) {
        throw new Exception("PDF URL is required and cannot be empty");
    }

    // Validate URL format
    if (!filter_var($data->pdf_url, FILTER_VALIDATE_URL)) {
        throw new Exception("Invalid PDF URL format");
    }

    $stmt = $db->prepare("INSERT INTO books (title, author, description, pdf_url) 
                         VALUES (:title, :author, :description, :pdf_url)");
    
    $title = strip_tags($data->title);
    $author = strip_tags($data->author);
    $description = strip_tags($data->description);
    $pdf_url = filter_var($data->pdf_url, FILTER_SANITIZE_URL);

    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":author", $author);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":pdf_url", $pdf_url);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Book added successfully",
            "id" => $db->lastInsertId()
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        throw new Exception("Database error: " . $errorInfo[2]);
    }
} catch (Exception $e) {
    error_log("Add Book Error: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "debug_info" => [
            "request_method" => $_SERVER['REQUEST_METHOD'],
            "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'not set',
            "error" => $e->getMessage()
        ]
    ]);
}
?>
