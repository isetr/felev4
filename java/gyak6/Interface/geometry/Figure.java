package geometry;

public interface Figure extends Movable, Comparable<Figure> {
    double area();
    String show();
}
