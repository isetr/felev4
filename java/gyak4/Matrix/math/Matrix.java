package math;

public class Matrix {
    public static int[][] plus(int[][] a, int[][] b) {
        int rows = a.length;
        int cols = a[0].length;

        int[][] c = new int[rows][];

        for(int i = 0; i < a.length; ++i) {
            c[i] = new int[cols];
        }

        for(int i = 0; i < rows; ++i) {
            for(int j = 0; j < cols; ++j) {
                c[i][j] = a[i][j] + b[i][j];
            }
        }

        return c;
    }
}