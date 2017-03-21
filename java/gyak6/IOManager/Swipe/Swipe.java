import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Random;

class Swipe {
    public static void main(String[] args) throws FileNotFoundException, IOException  {
        if(args.length == 2) {
            FileOutputStream fs = new FileOutputStream(args[0]);
            int numOfBytes = Integer.parseInt(args[1]);
            Random r = new Random();
            byte[] buffer = new byte[1];
            for(int i = 0; i < numOfBytes; ++i) {
                r.nextBytes(buffer);
                fs.write(buffer);
            }
            fs.close();
        }
    }
}