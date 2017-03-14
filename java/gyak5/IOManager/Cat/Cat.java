import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;

public class Cat {
    public static void main(String[] args) {
        try {
            Scanner s = new Scanner(new File(args[0]));

            while(s.hasNextLine()) {
                System.out.println(s.nextLine());
            }

            s.close();
        } catch(FileNotFoundException ex) {
            System.out.println("File not found.");
        }
    }
}