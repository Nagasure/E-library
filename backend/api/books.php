<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $author = $_POST['author'];
    $description = $_POST['description'];
    
    // Handle PDF upload
    $pdf_url = '';
    if (isset($_FILES['pdf_file'])) {
        $pdf_file = $_FILES['pdf_file'];
        $upload_dir = '../pdf/';
        $file_name = time() . '_' . basename($pdf_file['name']);
        $target_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($pdf_file['tmp_name'], $target_path)) {
            $pdf_url = 'http://localhost/e-library-web-app/backend/pdf/' . $file_name;
        }
    }

    $query = "INSERT INTO books (title, author, description, pdf_url) VALUES (?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([$title, $author, $description, $pdf_url]);
    
    echo json_encode(['message' => 'Book added successfully', 'pdf_url' => $pdf_url]);
}

$query = "SELECT * FROM books";
$stmt = $db->prepare($query);
$stmt->execute();

$books = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($books);
?>