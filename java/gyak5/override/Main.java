import util.IntList;

class Main {
    public static void main(String[] args) {
        IntList ns1 = new IntList();
        IntList ns2 = new IntList(new int[]{1,2,3,4,5});

        System.out.println(ns1.get());
        System.out.println(ns2.get(2));
    }
}