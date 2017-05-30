<?php

require_once 'functions.php';
allow('GET');
auth();

$expenses = load_from_file('data.json');
//var_dump($expenses);

$flashData = load_from_flash();
$errors = $flashData['errors'] ?: [];
$messages = $flashData['messages'] ?: [];

require 'header.tpl.php';
?>

<form method="post" action="logout.php">
    Szia, <?= $_SESSION['logged_in'] ?>
    <input type="submit" value="Kijelentkezés">
</form>

<div>
    A játék lényege, hogy a tükrök segítségével a lézert a megadott számú célon átvezessük.
</div>

<canvas id="gameTable"></canvas>

<button id="easy">Easy</button>
<button id="medium">Medium</button>
<button id="hard">Hard</button>

<script src="script.js"></script>