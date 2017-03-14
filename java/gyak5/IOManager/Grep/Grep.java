import java.util.Scanner;
import java.io.*;

public class Grep {
    public static void main(String[] args) {
        try {
            Scanner s = new Scanner(new File(args[1]));

            while(s.hasNextLine()) {
                String temp = s.nextLine();
                if(temp.contains(args[0])) {
                    System.out.println(temp);
                }
            }

            s.close();
        } catch(FileNotFoundException ex) {
            System.out.println("File not found.");
        }
    }
}