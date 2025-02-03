<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

try {
    $database = new Database();
    $db = $database->getConnection();
    $data = json_decode(file_get_contents("php://input"));
    
    if (!$data || !isset($data->id)) {
        throw new Exception("Book ID is required");
    }

    $stmt = $db->prepare("DELETE FROM books WHERE id = :id");
    $stmt->bindParam(":id", $data->id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        throw new Exception("Failed to delete book");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>