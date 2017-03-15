package router;

public class Packet {
    public static int INIT_TTL = 50;

    private String msg;
    private IPAddress source;
    private IPAddress destination;
    private int TTL;

    public Packet(String msg, int ttl, IPAddress source, IPAddress destination) {
        this.msg = msg;
        this.TTL = ttl;
        this.source = source;
        this.destination = destination;
    }

    public Packet(String msg, IPAddress source, IPAddress destination) {
        this.msg = msg;
        this.TTL = INIT_TTL;
        this.source = source;
        this.destination = destination;
    }

    public IPAddress getDestination() {
        return destination;
    }

    public IPAddress getSource() {
        return source;
    }

    public void decreaseTTL() {
        --TTL;
    }

    public boolean isLive() {
        return TTL > 0;
    }

    public String toString() {
        return source.toString() + " -> " + destination.toString() + " , "  + msg;
    }

    public String getData() {
        return msg;
    }
}