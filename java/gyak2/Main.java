class Main {
    public static void main(String[] args) {
        Person a = new Person("Lulz", "NotReally", 1976);
        Person b = new Person("Mufi", "Sucks", 2005);
        Car c1 = new Car("AAA-111", 4, a);
        Car c2 = new Car("AAA-112", 5, b);
        /*
        System.out.println(a.toString());
        Person.isUpperCase = true;
        System.out.println(b.toString());
        Person.isUpperCase = false;
        */

        if(c1.isValid()) System.out.println(c1.toString());
        if(c2.isValid()) System.out.println(c2.toString());
    }
}