<?php

require_once 'functions.php';
allow('GET');

$flashData = load_from_flash();
$errors = $flashData['errors'] ?: [];
$messages = $flashData['messages'] ?: [];

require 'header.tpl.php';
?>
<form method="post" action="auth.php">
    <div>
        <label for="email">Email-cím</label>
        <input type="text" name="email" id="email">
    </div>
    <div>
        <label for="password">Jelszó</label>
        <input type="password" name="password" id="password">
    </div>
    <div><input type="submit" value="Bejelentkezés"></div>
</form>

<?php foreach ($errors as $error) : ?>
    <div class="alert alert-danger"><?= $error ?></div>
<?php endforeach; ?>
<?php foreach ($messages as $message) : ?>
    <div class="alert alert-info"><?= $message ?></div>
<?php endforeach; ?>

