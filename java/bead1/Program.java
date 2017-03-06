class Program {
    public static void main(String[] args) {
        CelestialObject Earth = new CelestialObject(5, 0, 1, 100, 1);
        CelestialObject Mars = new CelestialObject(0, 20, 7, 150, 2);
        CelestialObject BlackHole = new CelestialObject(0, 0, 0, 100000, 1000);

        System.out.println("Earth--Mars tavolsag: " + Earth.distance(Mars) +
                           " ezer km\n Earth--Mars kozotti ero: " + Earth.attractiveForce(Mars) +
                           " N\n Earth--BlackHole kozotti ero: " + Earth.attractiveForce(BlackHole) +
                           " N\n 70 kg-os ember a Foldon: " + Earth.weight(70) +
                           " N\n 70 kg-os ember a Marson: " + Mars.weight(70) +
                           " N");
    }
}