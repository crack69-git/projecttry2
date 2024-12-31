<?php
// Start the session
session_start();

// Destroy the session and all data
session_unset();
session_destroy();

// Redirect to the login or home page
header("Location: index.html"); // Change 'index.php' to your login page URL
exit();
?>
