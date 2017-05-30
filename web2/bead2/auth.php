<?php

require_once 'functions.php';
allow('POST');

$input = [];
$errors = [];
$messages = [];

if (not_empty($_POST, 'email')) {
    $input['email'] = $_POST['email'];
} else {
    $errors[] = 'Nem adtál meg email címet!';
}

if (not_empty($_POST, 'password')) {
    $input['password'] = $_POST['password'];
} else {
    $errors[] = 'Nem adtál meg jelszót!';
}

if (!$errors) {
    if (password_verify($input['password'], password_hash('admin', PASSWORD_DEFAULT)) && $input['email'] == 'admin@admin.hu') {
        $_SESSION['logged_in'] = 'Admin';
        $messages[] = 'Sikeres bejelentkezés';
        save_to_flash([
            'errors'   => $errors,
            'messages' => $messages
        ]);
        redirect('index.php');
    } else {
        $errors[] = 'Hibás felhasználónév vagy jelszó!';
    }
}

save_to_flash([
    'errors'   => $errors,
    'messages' => $messages
]);
redirect('login.php');