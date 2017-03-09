import java.util.LinkedList;
import java.util.Scanner;

class Reverse {
    public static void main(String[] args) {
        LinkedList<String> llist = new LinkedList<>();
        Scanner scan = new Scanner(System.in);

        while(scan.hasNextLine()) {
            llist.push(scan.nextLine());
        }
        for(int i = llist.size(); i > 0; --i) {
            System.out.println(llist.pop());
        }
    }
}