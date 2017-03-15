package tests;

import router.*;
import utest.*;

public class NodeTest extends Testable {
    public void assertion() {
        IPAddress ip1 = new IPAddress(new int[] {8, 8, 8, 8});
        IPAddress ip1_low = new IPAddress(new int[] {10, 0, 0, 0});
        IPAddress ip1_high = new IPAddress(new int[] {192, 168, 255, 255});

        IPAddress ip2 = new IPAddress(new int[] {10, 0, 0, 1});
        IPAddress ip2_low = new IPAddress(new int[] {10, 0, 0, 0});
        IPAddress ip2_high = new IPAddress(new int[] {10, 0, 0, 255});

        IPAddress ip3 = new IPAddress(new int[] {192, 168, 0, 1});
        IPAddress ip3_low = new IPAddress(new int[] {192, 168, 0, 0});
        IPAddress ip3_high = new IPAddress(new int[] {192, 168, 0, 255});

        IPAddress ip4 = new IPAddress(new int[] {192, 168, 1, 5});
        
        Packet p1 = new Packet("p1", 10, ip1, ip2);
        Packet p2 = new Packet("p2", ip3, ip2);
        Packet p3 = new Packet("p3", 1, ip3, ip2);
        Packet p4 = new Packet("p4", ip2, ip4);

        Node n1 = new Node(ip1, ip1_low, ip1_high);
        Node n2 = new Node(ip2, ip2_low, ip2_high);
        Node n3 = new Node(ip3, ip3_low, ip3_high);

        Node.connect(n1, 0, n2, 0);
        Node.connect(n1, 1, n3, 0);

        n1.route(p1);
        String out = n2.getPackets();
        check("Node.route(): a csomag nem ert celba.", out.contains(ip1.toString()) && out.contains(ip2.toString()) && out.contains("p1"));

        n3.route(p2);
        out = n2.getPackets();
        check("Node.route(): a csomag nem ert celba. (2)", out.contains(ip3.toString()) && out.contains(ip2.toString()) && out.contains("p2"));

        n3.route(p3);
        out = n3.getPackets();
        check("Node.route(): a csomagnak nem szabadna celba ernie, a cel tul messze van.", n2.getPackets().isEmpty() && out.contains("Time is exceeded"));
        check("Node.route(): a visszakuldott csomag feladoja nem az, amelyik visszakuldte a csomagot vagy a csomagot rossz csomopont kuldte vissza." + out, out.contains(ip1.toString() + " ->"));
        check("Node.route(): a visszakuldott csomag cimzettje nem az eredeti felado.", out.contains("-> " + ip3.toString()));

        n2.route(p4);
        out = n2.getPackets();
        check("Node.route(): a csomagnak nem szabadna celba ernie, a cel nem elerheto. (2)", out.contains("Destination is unreachable"));
        check("Node.route(): a visszakuldott csomag feladoja nem az, amelyik visszakuldte a csomagot vagy a csomagot rossz csomopont kuldte vissza. (2)", out.contains(ip1.toString() + " ->"));
        check("Node.route(): a visszakuldott csomag cimzettje nem az eredeti felado.", out.contains("-> " + ip2.toString()));

        out = n3.traceRoute(ip2);
        check("Node.traceRoute(): rosszul deriti fel az utvonalat." + out, String.format("%s , %s , %s", ip3, ip1, ip2).equals(out));
    }

    public String description() { return "router.Node"; }
    public String className() { return "router.Node"; }

    public Object[] expectedMethods() throws Exception {
        return new Object[]
        { constructor(className(), new Class<?>[] {IPAddress.class, IPAddress.class, IPAddress.class})
        , staticMethod(className() + ".connect", new Class<?>[] {Node.class, Integer.TYPE, Node.class, Integer.TYPE})
        , method(className() + ".route", Packet.class)
        , method(className() + ".traceRoute", IPAddress.class)
        , method(className() + ".getPackets")
        };
    }

    public Object[] expectedFields() throws Exception {
        return new Object[] {};
    }

    public static void main(String... args) {
        Test.main(new NodeTest());
    }
}
