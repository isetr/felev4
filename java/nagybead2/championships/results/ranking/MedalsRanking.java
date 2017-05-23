package championships.results.ranking;

import java.io.*;
import java.util.*;
import java.util.stream.*;
import java.io.FileNotFoundException;

import championships.results.Participant;

public class MedalsRanking implements Ranking<Medals> {
    private Map<String, List<Participant>> events;

    public MedalsRanking (Map<String, List<Participant>> events) {
        this.events = events;
    }

    public Set<String> getNations() {
        Set<String> out = new HashSet<String>();
        events.forEach((k, v) -> out.add(k));
        return out;
    }

    public Medals getPointsOf(String nation) {
        int[] temp = new int[3];
        events.forEach((k, v) ->
            v.forEach((Participant p) -> {
                if (p != null && p.getNation().equals(nation) && v.indexOf(p) < 3) temp[v.indexOf(p)]++;
            })
        );
        return new CountedMedals(temp[0], temp[1], temp[2]);
    }

    public Map<String, Medals> getPointsOfAll() {
        Map<String, Medals> out = new HashMap<>();
        events.forEach((k, v) -> {
            v.forEach((Participant p) -> {
                if(p != null && !out.containsKey(p.getNation())) {
                    out.put(p.getNation(), getPointsOf(p.getNation()));
                } else if(p != null) {
                    Medals tmpMedal = new CountedMedals(getPointsOf(p.getNation()).getGolds() + out.get(p.getNation()).getGolds(),
                                                getPointsOf(p.getNation()).getSilvers() + out.get(p.getNation()).getSilvers(),
                                                getPointsOf(p.getNation()).getBronzes() + out.get(p.getNation()).getBronzes());
                    out.replace(p.getNation(), tmpMedal);
                }
            });
        });
        return out;
    }

    public List<String> getRanking() {
        Map<String, Medals> tmp = getPointsOfAll();
        List<String> out = new LinkedList<>();
        out = tmp.entrySet().stream()
            .sorted(Comparator.comparing(Map.Entry::getValue))
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
        Collections.reverse(out);
        return out;
    }

    public List<String> getTop3() {
        List<String> out = getRanking();
        return out.stream()
            .limit(3)
            .collect(Collectors.toList());
    }

    public void printRankingToFile(String filename) throws FileNotFoundException {
        PrintWriter writer = new PrintWriter(filename);
        
        getRanking().forEach(nation -> {
                writer.print(nation + ": " + getPointsOf(nation));
                writer.println();
        });

        writer.flush();
    }
}