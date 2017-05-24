package championships.results;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.*;
import java.lang.IllegalArgumentException;

import championships.results.ranking.*;

public class ChampionshipResults implements Results {
    private Map<String, List<Participant>> events;

    public ChampionshipResults() {
        events = new HashMap<>();
    }

    public void addResult(String event, Participant participant, int place) throws IllegalArgumentException {
        if (event == null || event.equals("") || place < 0) throw new IllegalArgumentException();

        List<Participant> tempList = events.getOrDefault(event, new ArrayList<>());
        if(tempList.size() < place) {
            for(int i = tempList.size(); i < place; ++i) tempList.add(null);
        }
        if(tempList.get(place-1) != null) throw new IllegalArgumentException();
        tempList.set(place-1, participant);

        if(events.containsKey(event)) {
            events.replace(event, tempList);
        } else {
            events.put(event, tempList);
        }
    }

    public void addResult(String event, String name, String nation, int place) throws IllegalArgumentException {
        if(name == null || name.equals("") || nation == null || nation.equals("")) throw new IllegalArgumentException();
        
        addResult(event, new Person(name, nation), place);
    }

    public List<Participant> getResultsOf(String event) {
        List<Participant> out = new ArrayList<>();
        for(Participant p : events.get(event)) {
            out.add(new Person(p.getName(), p.getNation()));
        }
        return out;
    }

    public Map<String,List<Participant>> getResultsOfAll() {
        Map<String,List<Participant>> out = new HashMap<>();
        events.forEach((k, v) -> {
            out.put(k, getResultsOf(k));
        });
        return out;
    }

    public Ranking<Medals> rankNationsByGoldFirst() {
        return new MedalsRanking(events);
    }

    public Ranking<Integer> rankNationsByTotalMedals() {
        return new TotalMedalsRanking(events);
    }

    public void readFromFile(String filename) throws FileNotFoundException {
        Scanner file = new Scanner(new FileReader(filename));

        while(file.hasNext()) {
            String[] data = file.nextLine().split(";");

            if(data.length == 4) {
                String[] person = data[1].split(" ");
                try {
                    if(person.length == 2) {
                        addResult(data[0], person[0] + " " + person[1], data[2], Integer.parseInt(data[3]));
                    }
                } catch (IllegalArgumentException e) {
                    System.err.println("error");
                }
            }
        }
    }

}