A következő futtatásra:

		Results results = ...
		results.readFromFile("input.txt");
		results.rankNationsByGoldFirst().printRankingToFile("goldFirstOutput.txt");
		results.rankNationsByTotalMedals().printRankingToFile("totalMedalsOutput.txt");

ahol a results egy megvalósító osztály egy példánya, az elkészült fájloknak a megfelelő
_mo fájl tartalmával karakterre egyező eredményt kell adniuk.

(A feladat szövege kimondja, hogy egyező pontszámú nemzetek között a rangsor tetszőleges.
A mintában szándékosan nincs egyik rangsorolás szerint se egyezés, hogy a kimenet egyértelmű
legyen.)
