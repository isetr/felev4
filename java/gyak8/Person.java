class Person {
    private String name, address;
    protected long wage;

    public Person(String name, String address) {
        this.name = name;
        this.address = address;
        this.wage = 30000;
    }

    public String getName() { return name; }

    public String getAddress() { return address; }

    @Override
    public String toString() {
        return String.format("%s (%s), wage: %l", name, address, wage);
    }

    public void raise() {
        wage += 10000;
    }
}