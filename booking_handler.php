<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Form fields
    $name = trim($_POST['name'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $room = trim($_POST['room'] ?? '');
    $checkin = trim($_POST['checkin'] ?? '');
    $checkout = trim($_POST['checkout'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $consent = isset($_POST['consent']) ? 'Yes' : 'No';

    // Validate required fields
    if (!$name || !$email || !$room || !$checkin || !$checkout || !$consent) {
        echo "Please fill all required fields.";
        exit;
    }

    // File upload
    $uploadedFile = $_FILES['passport_photo'] ?? null;
    $uploadOk = false;
    $attachmentPath = '';
    if ($uploadedFile && $uploadedFile['error'] === UPLOAD_ERR_OK) {
        $targetDir = __DIR__ . '/uploads/';
        if (!file_exists($targetDir)) mkdir($targetDir, 0755, true);

        $filename = basename($uploadedFile['name']);
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if (in_array($extension, ['jpg', 'jpeg', 'png'])) {
            $attachmentPath = $targetDir . time() . '_' . $filename;
            if (move_uploaded_file($uploadedFile['tmp_name'], $attachmentPath)) {
                $uploadOk = true;
            }
        }
    }

    // Email
    $to = 'dunedelightdakhla@gmail.com'; // change if needed
    $subject = "New Booking Request from $name";
    $body = "
Name: $name
Address: $address
Email: $email
Phone: $phone
Room: $room
Check-in: $checkin
Check-out: $checkout
Consent: $consent

Message:
$message
";

    $headers = "From: $name <$email>\r\n";

    // If there’s an attachment, use multipart email
    if ($uploadOk) {
        $fileContent = chunk_split(base64_encode(file_get_contents($attachmentPath)));
        $boundary = md5(time());

        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

        $bodyWithAttachment = "--$boundary\r\n";
        $bodyWithAttachment .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $bodyWithAttachment .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $bodyWithAttachment .= $body . "\r\n";
        $bodyWithAttachment .= "--$boundary\r\n";
        $bodyWithAttachment .= "Content-Type: application/octet-stream; name=\"" . basename($attachmentPath) . "\"\r\n";
        $bodyWithAttachment .= "Content-Transfer-Encoding: base64\r\n";
        $bodyWithAttachment .= "Content-Disposition: attachment; filename=\"" . basename($attachmentPath) . "\"\r\n\r\n";
        $bodyWithAttachment .= $fileContent . "\r\n";
        $bodyWithAttachment .= "--$boundary--";

        if (mail($to, $subject, $bodyWithAttachment, $headers)) {
            echo "Booking request sent successfully!";
        } else {
            echo "Error sending booking request.";
        }
    } else {
        // No attachment
        if (mail($to, $subject, $body, $headers)) {
            echo "Booking request sent successfully!";
        } else {
            echo "Error sending booking request.";
        }
    }

} else {
    echo "Invalid request method.";
}
?>
