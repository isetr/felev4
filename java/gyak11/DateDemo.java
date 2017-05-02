class DateDemo {
    public static void main(String[] args) {
        Date d = new Date(2017, Month.MAY, 2);

        for(Month m : Month.values()) {
            System.out.println(m.ordinal() + " " + m + " " + m.name());
        }
    }
}