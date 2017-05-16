import java.util.*;
import java.util.stream.*;

class Program {
    public static void main(String[] args) {
        List<Book> books = new LinkedList<>();
        books.add(new Book("J.K. Rowling", "Harry Potter 1", 3990));
        books.add(new Book("Simon Péter", "Bevanal", 6000));
        books.add(new Book("Douglas Adams", "Galaxis utikalauz", 10000));

        List<String> expensiveBooks = books.stream()
            .filter((Book b) -> 
                b.price >= 5000
            )
            .map((Book b) ->
                b.title
            )
            .collect(Collectors.toList());

        Optional<String> expensiveBook = books.stream()
            .filter((Book b) -> b.price >= 5000)
            .map((Book b) -> { System.out.println(b); return b.title; })
            .findFirst();

        if(expensiveBook.isPresent()) {
            System.out.println(expensiveBook.get());
        }
    }
}