class Student extends Person {
    private List<Integer> courses;

    public Student(String name, String address, List<Integer> courses) {
        super(name, address);
        this.courses = new ArrayList<>();
        this.courses.addAll(courses);
    }

    @Override
    public String toString() {
        return "Student: " + super.toString();
    }

    @Override
    public void raise() {
        wage += 20000;
    }
}