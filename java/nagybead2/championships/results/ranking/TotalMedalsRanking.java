package championships.results.ranking;

import java.io.*;
import java.util.*;
import java.util.stream.*;
import java.io.FileNotFoundException;

import championships.results.Participant;

public class TotalMedalsRanking implements Ranking<Integer> {
    private Map<String, List<Participant>> events;

    public TotalMedalsRanking(Map<String, List<Participant>> events) {
        this.events = events;
    }

    public Set<String> getNations() {
        Set<String> out = new HashSet<String>();
        events.forEach((k, v) -> out.add(k));
        return out;
    }

    public Integer getPointsOf(String nation) {
        int[] out = new int[1];
        out[0] = 0;
        events.forEach((k, v) -> {
            v.forEach((Participant p) -> {
                if (p != null && p.getNation().equals(nation) && v.indexOf(p) < 3) {
                    out[0] += 1;
                };
            });
        });
        int tmp = new Integer(out[0]);
        return tmp;
    }

    public Map<String, Integer> getPointsOfAll() {
        Map<String, Integer> out = new HashMap<>();
        events.forEach((k, v) -> {
            v.forEach((Participant p) -> {
                if(p != null && !out.containsKey(p.getNation())) {
                    out.put(p.getNation(), getPointsOf(p.getNation()));
                }
            });
        });
        return out;
    }

    public List<String> getRanking() {
        Map<String, Integer> tmp = getPointsOfAll();
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