package tests;

import router.IPAddress;
import router.Packet;
import utest.*;

public class PacketTest extends Testable {
    public void assertion() {
        IPAddress ip1 = new IPAddress(new int[] {192, 168, 0, 5});
        IPAddress ip2 = new IPAddress(new int[] {10, 10, 0, 2});
        
        Packet p1 = new Packet("ping", 10, ip1, ip2);
        Packet p2 = new Packet("ping", ip1, ip2);

        check("Packet.INIT_TTL erteke nem 50.", Packet.INIT_TTL == 50);

        check("Packet.isLive(): hamisat ad az elo csomagra. (1).", p2.isLive());
        for (int i = 0; i < 49; i++)
            p2.decreaseTTL();
        check("Packet.isLive(): hamisat ad az elo csomagra. (2).", p2.isLive());
        p2.decreaseTTL();
        check("Packet konstruktor: az alapertelmezett ttl nem 50.", !p2.isLive());

        check("Packet.getSource(): nem a kuldo cimet adja vissza.", ip1.isTheSame(p1.getSource()));
        check("Packet.getDestination(): nem a cimzettet adja vissza.", ip2.isTheSame(p1.getDestination()));
        check("Packet.getData(): nem az adatot adja vissza.", "ping".equals(p1.getData()));
        check("Packet.isLive(): hamisat ad az elo csomagra.", p1.isLive());
        for (int i = 0; i < 9; i++)
            p1.decreaseTTL();
        check("Packet.isLive(): hamisat ad az elo csomagra. (3)", p1.isLive());
        p1.decreaseTTL();
        check("Packet.isLive(): igazat ad a nem elo csomagra.", !p1.isLive());

        check("Packet.toString(): nem helyes eredmenyt ad.", p2.toString().contains(ip1.toString() + " ->") && p2.toString().contains("-> " + ip2.toString()) && p2.toString().contains(", ping"));
    }

    public String description() { return "router.Packet"; }
    public String className() { return "router.Packet"; }

    public Object[] expectedMethods() throws Exception {
        return new Object[]
        { constructor(className(), new Class<?>[] {String.class, Integer.TYPE, IPAddress.class, IPAddress.class})
        , constructor(className(), new Class<?>[] {String.class, IPAddress.class, IPAddress.class})
        , method(className() + ".getSource")
        , method(className() + ".getData")
        , method(className() + ".getDestination")
        , method(className() + ".decreaseTTL")
        , method(className() + ".isLive")
        , method(className() + ".toString")
        };
    }

    public Object[] expectedFields() throws Exception {
        return new Object[] { staticField(className() + ".INIT_TTL") };
    }

    public static void main(String... args) {
        Test.main(new PacketTest());
    }
}
