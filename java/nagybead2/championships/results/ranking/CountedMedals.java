package championships.results.ranking;

import championships.results.ranking.*;

public class CountedMedals implements Medals {
    int bronze, silver, gold;

    public CountedMedals(int gold, int silver, int bronze) {
        this.bronze = bronze;
        this.silver = silver;
        this.gold = gold;
    }

    public int compareTo(Medals obj) {
        if (gold == obj.getGolds()) {
            if(silver == obj.getSilvers()) {
                if(bronze == obj.getBronzes()) {
                    return 0;
                } else {
                    return bronze - obj.getBronzes();
                }
            } else {
                return silver - obj.getSilvers();
            }
        } else {
            return gold - obj.getGolds();
        }
    }


    public boolean equals(Object obj) {
        if(obj != null && obj instanceof CountedMedals) {
            CountedMedals other = (CountedMedals) obj;
            return other.getBronzes() == bronze && other.getSilvers() == silver && other.getGolds() == gold;
        }
        return false;
    }

    public int getBronzes() {
        return bronze;
    }

    public int getGolds() {
        return gold;
    }

    public int getSilvers() {
        return silver;
    }

    public int hashCode() {
        return 100 * gold + 10 * silver + bronze;
    }

    public String toString() {
        return String.format("<%d, %d, %d>", gold, silver, bronze);
    }
}