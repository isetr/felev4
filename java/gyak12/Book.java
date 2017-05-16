class Book {
    public final String title, author;
    public final int price;

    public Book(String author, String title, int price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    @Override
    public String toString() {
        return String.format("Book[%s: %s (%d)]", author, title, price);
    }
}