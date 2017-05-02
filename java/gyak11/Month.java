enum Month {
    JAN("jan"), 
    FEB("feb"), 
    MAR("mar"), 
    APR("apr"), 
    MAY("may"), 
    JUN("jun"), 
    JUL("jul"), 
    AUG("aug"), 
    SEP("sep"), 
    OCT("oct"), 
    NOV("nov"), 
    DEC("dec");

    Month(String name) {
        this.name = name;
    }

    private String name;

    public String toString() {
        return name;
    }
}