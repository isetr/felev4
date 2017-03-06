import java.lang.Math;
class CelestialObject {
    CelestialObject(int x, int y, int z, double mass, double gravity) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.mass = mass;
        this.gravity = gravity;
    }

    double distance(CelestialObject other) {
        return Math.sqrt(Math.pow((x - other.x), 2) + Math.pow((y - other.y), 2) + Math.pow((z - other.z), 2));
    }

    double attractiveForce(CelestialObject other) {
        return (6.674e-11 * mass * other.mass) / Math.pow(distance(other), 2);
    }

    double weight(int kg) {
        return kg * gravity;
    }

    double mass, gravity;
    int x, y, z;
}