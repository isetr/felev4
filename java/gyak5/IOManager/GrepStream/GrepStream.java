import java.io.*;

public class GrepStream {
    public static void main(String[] args) throws IOException {
        try {
            FileReader fd = new FileReader(args[1]);
            BufferedReader br = new BufferedReader(fd);
            String line;
            while((line = br.readLine()) != null) {
                if(line.contains(args[0])) {
                    System.out.println(line);
                }
            }

            br.close();
        } catch(FileNotFoundException ex) {
            System.out.println("File not found.");
        }
    }
}