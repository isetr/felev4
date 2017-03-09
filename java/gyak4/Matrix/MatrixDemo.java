import java.util.Arrays;

import math.Matrix;
class MatrixDemo {
    public static void main(String[] args) {
        int[][] a = new int[][] { {1,2}, {3,4} };
        int[][] b = new int[][] { {4,2}, {7,8} };

        int[][] c = Matrix.plus(a, b);

        for(int i = 0; i < c.length; ++i) {
           System.out.println(Arrays.toString(c[i]));
        }
    }
}