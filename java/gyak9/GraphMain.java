public class GraphMain {
    public static void main(String[] args) {
        Graph g = new DenseGraph(5);
        g.addEdge(0, 1);
        g.addEdge(1, 2);
        g.addEdge(0, 2);
        g.addEdge(0, 3);
        g.addEdge(0, 4);

        System.out.println(g.hasEdge(1, 0));
        System.out.println(g.neighboursOf(1));
        System.out.println(g.neighboursOf(0));
        System.out.println(g.depthFirstTraversal(1));
    }
}