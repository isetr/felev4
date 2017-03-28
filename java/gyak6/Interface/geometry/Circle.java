package geometry;

public class Circle implements Figure {
    private int r, x, y;
    
    public Circle(int r, int x, int y) {
	this.r = r;
	this.x = x;
	this.y = y;
    }

    public String show() {
	//	return "Circle at (" + x + "," + y + "), radius: " + r;
	return String.format("Circle at (%d, %d), radius: %d", x, y, r);
    }

    public void move(int dx, int dy) {
	x += dx;
	y += dy;
    }
    
    public double area() {
	return Math.PI * r * r;
    }

    public int compareTo(Figure f) {
	return (int)(this.area() - f.area());
    }
}
