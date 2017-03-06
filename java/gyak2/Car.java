class Car {
    Car(String ID, int Doors, Person Owner) {
        id = ID;
        doors = Doors;
        owner = Owner;
    }

    boolean isFamilyCar() {
        return doors == 5;
    }

    boolean isValid() {
        return !id.isEmpty() && doors >= 3 &&
                doors <= 5 && owner != null &&
                owner.isAdult(2017);
    }

    public String toString() {
        return id + " " + doors + ", owner: " + owner.toString();
    }

    String id;
    int doors;
    Person owner;
}