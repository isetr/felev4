package tests;

import router.IPAddress;
import utest.*;

import java.util.Arrays;

public class IPAddressTest extends Testable {
    public void assertion() {
        int[] ns = new int[] {192, 168, 0, 5};
        IPAddress ip1 = new IPAddress(ns);
        IPAddress ip2 = new IPAddress(Arrays.copyOf(ns, ns.length));
        IPAddress ip3 = new IPAddress(new int[] {192, 168, 0, 4});
        IPAddress ip4 = new IPAddress(new int[] {192, 170, 0, 5});
        IPAddress ip5 = new IPAddress(new int[] {193, 168, 0, 2});

        ns[3] = 2;
        check("IPAddress konstruktor: engedi szivarogni a belso allapotot.", ip1.isTheSame(ip2));
        check("IPAddress.isTheSame(): igazat ad kulonbozo ip cimek eseten.", !ip1.isTheSame(ip3));
        check("IPAddress.isTheSame(): igazat ad kulonbozo ip cimek eseten. (2)", !ip1.isTheSame(ip4));
        
        IPAddress short_ip = new IPAddress(new int[] {10});
        check("IPAddress konstruktor: nem egesziti ki a rovid tombbot nullakkal.", short_ip.isTheSame(new IPAddress(new int[] {10, 0, 0, 0})));

        IPAddress long_ip = new IPAddress(new int[] {10, 11, 12, 13, 14});
        check("IPAddress konstruktor: nem vagja le a hosszu tomb veget.", long_ip.isTheSame(new IPAddress(new int[] {10, 11, 12, 13})));

        check("IPAddress.fromString(): letrehozza az objektumot helytelen adatokbol.", IPAddress.fromString("192") == null);
        check("IPAddress.fromString(): letrehozza az objektumot helytelen adatokbol.", IPAddress.fromString("192.168") == null);
        check("IPAddress.fromString(): letrehozza az objektumot helytelen adatokbol.", IPAddress.fromString("192.168.0") == null);
        check("IPAddress.fromString(): letrehozza az objektumot helytelen adatokbol.", IPAddress.fromString("192,168,0,1") == null);

        IPAddress ip6 = IPAddress.fromString("192.168.0.5");
        check("IPAddress.fromString(): nem hozza letre az objektumot helyes adatokbol.", ip6 != null);
        check("IPAddress.fromString(): nem jol hozza letre az objektumot helyes adatokbol.", ip1.isTheSame(ip6));

        check("IPAddress.fromString(): nem jol alakit szovegge.", "192.168.0.5".equals(ip1.toString()));

        check("IPAddress.insideRng(): nem jo eredmenyt ad. (1)", ip1.insideRng(ip3, ip4));
        check("IPAddress.insideRng(): nem jo eredmenyt ad. (2)", !ip4.insideRng(ip1, ip3));
        check("IPAddress.insideRng(): nem jo eredmenyt ad. (3)", !ip3.insideRng(ip1, ip5));
        check("IPAddress.insideRng(): nem jo eredmenyt ad. (4)", ip1.insideRng(ip3, ip5));
    }

    public String description() { return "router.IPAddress"; }
    public String className() { return "router.IPAddress"; }

    public Object[] expectedMethods() throws Exception {
        return new Object[]
        { constructor(className(), int[].class)
        , staticMethod(className() + ".fromString", String.class)
        , method(className() + ".isTheSame", IPAddress.class)
        , method(className() + ".insideRng", new Class<?>[] {IPAddress.class, IPAddress.class})
        , method(className() + ".toString")
        };
    }

    public Object[] expectedFields() throws Exception {
        return new Object[] {};
    }

    public static void main(String... args) {
        Test.main(new IPAddressTest());
    }
}
