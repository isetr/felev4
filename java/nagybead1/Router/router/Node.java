package router;

public class Node {
    private Node[] neighbors;
    private IPAddress ownIp;
    private IPAddress lobIP;
    private IPAddress hibIP;
    private Buffer buffer;

    public Node(IPAddress own, IPAddress lob, IPAddress hib) {
        ownIp = own;
        lobIP = lob;
        hibIP = hib;
        neighbors = new Node[4];
        for(int i = 0; i < 4; ++i) neighbors[i] = null;
        buffer = new Buffer(10);
    }

    public static void connect(Node node1, int node2index, Node node2, int node1index) {
        if(!(node2index < 0 || node2index > 4 || node1index < 0 || node1index > 4)) {
            node2.neighbors[node1index] = node1;
            node1.neighbors[node2index] = node2;
        }
    }

    public String getPackets() {
        Buffer tmp = buffer;
        String out = "";
        while(!tmp.isEmpty()) {
            out += tmp.removeFirst() + "\n";
        }
        return out;
    }

    public void route(Packet pck) {
        if(pck.getDestination().equals(ownIp)) {
            buffer.append(pck);
        } else {
            if(pck.isLive()) {
                int dest = -1;
                for(int i = 0; i < 4; ++i) {
                    if(neighbors[i] != null) {
                        if(pck.getDestination().insideRng(neighbors[i].lobIP, neighbors[i].hibIP)) {
                            dest = i;
                        }
                    }
                }
                if(dest >= 0) {
                    pck.decreaseTTL();
                    neighbors[dest].route(pck);
                } else {
                    this.route(new Packet("Destination is unreachable", ownIp, pck.getSource()));
                }
            } else {
                this.route(new Packet("Time is exceeded", ownIp, pck.getSource()));
            }
        }
    }

    public String traceRoute(IPAddress ip) {
        int ttl = 0;
        boolean l = false;
        String route = "";
        while(!l) {
            route(new Packet("traceroute", ttl, ownIp, ip));
            if(!buffer.isEmpty()) {
                Packet tmp = buffer.removeFirst();
                if(tmp.getData().equals("Time is exceeded")) {
                    route += tmp.getSource().toString() + " , ";
                }
            } else {
                route += ip.toString();
                l = true;
            }
            ++ttl;
        }
        return route;
    }
}