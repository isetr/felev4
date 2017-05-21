import java.io.FileNotFoundException;

import championships.results.*;
import championships.results.ranking.*;

class Tester {
    public static void main(String[] args) throws FileNotFoundException {
        Results results = Factory.createResults();
        results.readFromFile("input.txt");
		results.rankNationsByGoldFirst().printRankingToFile("goldFirstOutput.txt");
		results.rankNationsByTotalMedals().printRankingToFile("totalMedalsOutput.txt");
    }
}