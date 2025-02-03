<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once '../config/database.php';

try {
    $db = getDBConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO bookmarks (user_id, book_id, page_number) VALUES (:user_id, :book_id, :page_number)");
            $stmt->execute([
                ':user_id' => $data['user_id'],
                ':book_id' => $data['book_id'],
                ':page_number' => $data['page_number']
            ]);
            echo json_encode(['status' => 'success', 'message' => 'Bookmark saved']);
            break;

        case 'GET':
            $user_id = $_GET['user_id'];
            $book_id = $_GET['book_id'];
            $stmt = $db->prepare("SELECT * FROM bookmarks WHERE user_id = :user_id AND book_id = :book_id");
            $stmt->execute([':user_id' => $user_id, ':book_id' => $book_id]);
            echo json_encode(['status' => 'success', 'data' => $stmt->fetch(PDO::FETCH_ASSOC)]);
            break;
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
