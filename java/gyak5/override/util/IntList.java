package util;
import java.util.Arrays;

public class IntList {
    private int[] ns;

    public IntList() {
        ns = new int[0];
    }

    public IntList(int[] in) {
        ns = Arrays.copyOf(in, in.length);
    }

    public int get() {
        return ns[0];
    }

    public int get(int i) {
        return ns[i];
    }

}