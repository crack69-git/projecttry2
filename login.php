<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root"; // Replace with your DB username
$password = "12345678"; // Replace with your DB password
$dbname = "routine";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST['action']) && $_POST['action'] === "signup") {
        $username = $_POST['txt'];
        $email = $_POST['email'];
        $password = $_POST['broj']; // Assuming plain password (hashing needed)
        $confirmPassword = $_POST['pswd'];

        if ($password !== $confirmPassword) {
            echo "Passwords do not match!";
            exit();
        }

        // Check if user exists
        $checkQuery = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($checkQuery);
        if (!$stmt) {
            die("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo "Email already exists!";
        } else {
            // Hash password and insert user
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($insertQuery);
            if (!$stmt) {
                die("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("sss", $username, $email, $hashedPassword);

            if ($stmt->execute()) {
                $_SESSION['signup_success'] = "Signup successful! Please log in."; 
                header("Location: index.html");
                exit();
            } else {
                echo "Error: " . $stmt->error;
            }
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === "login") {
        $email = $_POST['email'];
        $password = $_POST['pswd'];

        // Fetch user from database
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            die("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                header("Location: homepage.html");
                exit();
            } else {
                echo "Invalid password!";
            }
        } else {
            echo "No user found with this email!";
        }
    }
}

$conn->close();
?>
