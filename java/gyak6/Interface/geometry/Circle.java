package geometry;

public class Circle extends Figure {
    private int r, x, y;

    public Circle(int xx, int yy, int rr) {
        x = xx;
        y = yy;
        r = rr;
    }

    public void move(int x, int y) {
        this.x += x;
        this.y += y;
    }

    public double area() {
        return Math.PI * r * r;
    }
    public String show() {
        return "Circle at: (" + x + ", " + y + "), with " + r + " radius.";
    }

    public int compareTo(Figure f) {
        if(this.area() > f.area()) return 1;
        if(this.area() < f.area()) return -1;
        return 0;
    }
}