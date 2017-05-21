package championships.results;

import championships.results.ChampionshipResults;

public final class Factory extends Object {
    public static Results createResults() {
        return new ChampionshipResults();
    }
}