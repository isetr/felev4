<?php

require_once 'functions.php';
allow('GET');

$expenses = load_from_file('data.json');
//var_dump($expenses);

$flashData = load_from_flash();
$errors = $flashData['errors'] ?: [];
$messages = $flashData['messages'] ?: [];

require 'header.tpl.php';
?>

<?php if (isset($_SESSION['logged_in'])) { ?>
    <form method="post" action="logout.php">
        Szia, <?= $_SESSION['logged_in'] ?>
        <input type="submit" value="Kijelentkezés">
    </form>
<?php } ?>

<canvas id="gameTable"></canvas>

<button id="easy">Easy</button>
<button id="medium">Medium</button>
<button id="hard">Hard</button>

<script src="script.js"></script>

<a href="index.php">Vissza a főoldalra</a>