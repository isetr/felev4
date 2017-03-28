class Main {
    public static void main(String[] args) {
        String s1 = "10.0.0.0";
        String s2 = "10.0.0.3";
        String s3 = "10.0.0.5";
        String s4 = "9.100.0.100";

        System.out.println(s2.compareTo(s1));
        System.out.println(s2.compareTo(s3));
        System.out.println(s2.compareTo(s4));
        System.out.println(s1.compareTo(s2));
        System.out.println(s1.compareTo(s4));
    }
}