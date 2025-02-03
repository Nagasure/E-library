<?php
require_once '../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->title) && isset($data->author) && isset($data->pdf_url)) {
    $query = "UPDATE books SET title = :title, author = :author, pdf_url = :pdf_url WHERE id = :id";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':author', $data->author);
    $stmt->bindParam(':pdf_url', $data->pdf_url);
    $stmt->bindParam(':id', $data->id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Book updated successfully."]);
    } else {
        echo json_encode(["message" => "Unable to update book."]);
    }
} else {
    echo json_encode(["message" => "Invalid input."]);
}
?>