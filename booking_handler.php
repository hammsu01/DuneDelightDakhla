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

    // Basic validation
    if (!$name || !$email || !$room || !$checkin || !$checkout || !$consent) {
        echo "Please fill all required fields.";
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Please provide a valid email address.";
        exit;
    }

    // Validate check-in and check-out dates
    if ($checkin >= $checkout) {
        echo "Check-out date must be after check-in date.";
        exit;
    }

    // Sanitize form data to prevent XSS
    $name = htmlspecialchars($name);
    $address = htmlspecialchars($address);
    $email = htmlspecialchars($email);
    $phone = htmlspecialchars($phone);
    $room = htmlspecialchars($room);
    $checkin = htmlspecialchars($checkin);
    $checkout = htmlspecialchars($checkout);
    $message = htmlspecialchars($message);

    // File upload
    $uploadedFile = $_FILES['passport_photo'] ?? null;
    $uploadOk = false;
    $attachmentPath = '';
    if ($uploadedFile && $uploadedFile['error'] === UPLOAD_ERR_OK) {
        $targetDir = __DIR__ . '/uploads/';
        if (!file_exists($targetDir)) mkdir($targetDir, 0755, true);

        $filename = basename($uploadedFile['name']);
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        // Check file type and size
        $allowedTypes = ['jpg', 'jpeg', 'png'];
        $allowedMIME = ['image/jpeg', 'image/png'];

        if (in_array($extension, $allowedTypes) && in_array($uploadedFile['type'], $allowedMIME)) {
            $attachmentPath = $targetDir . time() . '_' . $filename;
            if (move_uploaded_file($uploadedFile['tmp_name'], $attachmentPath)) {
                $uploadOk = true;
            } else {
                echo "Failed to upload file.";
                exit;
            }
        } else {
            echo "Invalid file type. Only JPG and PNG files are allowed.";
            exit;
        }
    }

    // Email content
    $to = 'dunedelightdakhla@gmail.com'; // Your email address
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
    $headers .= "Reply-To: $email\r\n"; // Ensure you can reply to the user

    // If there's an attachment, use multipart email
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

        // Optional: Delete uploaded file after sending
        unlink($attachmentPath);
    } else {
        // Send email without attachment
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
