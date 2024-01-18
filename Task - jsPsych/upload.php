<?php
// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $inputData = file_get_contents("php://input");
    
    // Decode JSON data
    $jsonData = json_decode($inputData, true);

    // Check if filename and filedata are present
    if (isset($jsonData['filename']) && isset($jsonData['filedata'])) {
        $uploadDirectory = 'data/'; // Specify the relative directory where you want to store uploaded files

        // Get the filename and file data from the JSON data
        $filename = $jsonData['filename'];
        $filedata = $jsonData['filedata'];

        // Construct the path to move the file to
        $destination = $uploadDirectory . $filename;

        // Move the file to the specified directory
        if (file_put_contents($destination, $filedata)) {
            // File upload successful
            echo json_encode(['success' => true]);
        } else {
            // File upload failed
            echo json_encode(['success' => false, 'error' => 'Error moving file']);
        }
    } else {
        // Missing filename or filedata in the request
        echo json_encode(['success' => false, 'error' => 'Missing filename or filedata']);
    }
} else {
    // Invalid request method
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}

// If await request.
// if (file_put_contents($destination, $filedata)) {
//     // File upload successful
//     echo json_encode(['success' => true, 'continue' => true]); // 'continue' flag set to true
// } else {
//     // File upload failed
//     echo json_encode(['success' => false, 'error' => 'Error saving file', 'continue' => false]);
// }
?>