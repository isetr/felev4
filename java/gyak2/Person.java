class Person {
    Person(String F, String L, int DOB) {
        fName = F;
        lName = L;
        dob = DOB;
    }

    boolean isAdult(int year) {
        return year - dob >= 18;
    }

    public String toString() {
        if(!isUpperCase) {
            return fName + " " + lName;
        }
        return fName.toUpperCase() + " " + lName.toUpperCase();
    }

    String fName;
    String lName;
    int dob;
    static boolean isUpperCase = false;
}