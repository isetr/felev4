package geometry;

public class Square implements Figure {
    private int x, y;
    private final int size;

    public Square(int size, int x, int y) {
        this.size = size;
        this.x = x;
        this.y = y;
    }

    public void move(int x, int y) {
        this.x += x;
        this.y += y;
    }

    public double area() {
        return size * size;
    }

    public String show() {
        return String.format("Square at (%d, %d), size: %d", x, y, size);
    }

    public int compareTo(Figure f) {
	    return (int)(this.area() - f.area());
    }
} 