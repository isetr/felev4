import geometry.*;

public class GeoDemo {
    public static void main(String[] args) {
        Figure f = new Circle(5, 1, 2);
        Figure f2 = new Square(2, 5, 5);
        
        if(f.compareTo(f2) > 0) {
            System.out.prtinln(String.format("%s nagyobb, mint %s", f.show(), f2.show()));
        } else if(f.compareTo(f2) == 0) {
            System.out.prtinln(String.format("%s egyenlő %s", f.show(), f2.show()));
        } else {
            System.out.prtinln(String.format("%s kisebb, mint %s", f.show(), f2.show()));
        }
    }
}