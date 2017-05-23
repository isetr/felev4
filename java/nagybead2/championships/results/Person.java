package championships.results;

public class Person implements Participant {
    private String name, nation;

    public Person(String name, String nation) {
        this.name = name;
        this.nation = nation;
    }

    public String getName() {
        return name;
    }

    public String getNation() {
        return nation;
    }
}