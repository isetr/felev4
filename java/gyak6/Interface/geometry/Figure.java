package geometry;

public interface Figure extends Moveable, Comparable<Figure> {
    double area();
    String show();

}