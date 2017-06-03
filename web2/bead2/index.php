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
<?php } else { ?>
    <a href="login.php">Bejelentkezés</a>
<?php } ?>
<a href="game.php">Játék indítása</a>

<div>
    <h2>A játék célja</h2>

    <p>Minden egyes feladványnál rendezd el úgy a megadott objektumokat a táblán, hogy megvilágítsd a feladványban megjelölt számú célpontot.<p>
</div>

<div>
    <h2>A játék menete</h2>

    <p>A játék egy 5x5-ös táblán zajlik, erre kell elhelyezni az adott feladványban szereplő összes objektumot. A feladvány három információt tartalmaz (ld. lent a Pályák részt):</br>

    A tábla kezdeti állapota. A feladvány tartalmazza a tábla kezdeti állapotát. Néhány objektum előre fel van téve a táblára. Ezek helyét változtatni nem szabad. Forgatni akkor nem szabad, ha az objektum jobb felső sarkában egy kis lakat ikon jelenik meg. Ha nincs ott a lakat ikon, akkor az objektum 90 fokonként elforgatható.
    A hozzáadandó elemek. Ugyancsak meg vannak a tábla mellett adva azok az elemek, amelyeket fel KELL rakni a táblára a feladat megoldásához. Ezek az elemek más elemekre nem rakhatók, viszont tetszőlegesen forgathatók 90 fokonként.
    A megvilágított célpontok száma. A feladvány tartalmazza, hogy hány célpontot kell megvilágítani a lézernek. A piros körrel jelzett tükrök cél oldalát mindenféleképpen el kell találni, de lehet, hogy piros körrel expliciten nem jelzett tükör cél oldalát kell eltalálni.
    A feladat megoldásához a feladványban szereplő összes objektumot fel kell használni. Pontosan a feladványkártyán szereplő mennyiségű célpontot kell aktiválni. A lézersugárnak minden, a feladványban felsorolt objektumot érintenie kell legalább egyszer (kivéve a blokkolót). A feladat akkor van megoldva, ha a lézersugár a megadott mennyiségű célpontot aktiválta, és (a blokkoló kivételével) minden jelzőt érintett legalább egyszer.</p>
</div>
