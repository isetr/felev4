package tests;

import router.*;
import utest.*;

public class BufferTest extends Testable {
    public void assertion() {
        IPAddress ip1 = new IPAddress(new int[] {192, 168, 0, 5});
        IPAddress ip2 = new IPAddress(new int[] {10, 10, 0, 2});
        IPAddress ip3 = new IPAddress(new int[] {10, 10, 10, 10});

        Packet p1 = new Packet("ping", ip1, ip2);
        Packet p2 = new Packet("ping", ip2, ip1);
        Packet p3 = new Packet("ping", ip2, ip3);

        Buffer b = new Buffer(3);
        check("Buffer.isEmpty(): a buffer kezdetben nem ures.", b.isEmpty());
        check("Buffer.isFull(): a buffer kezdetben teli.", !b.isFull());
        check("Buffer.removeFirst(): nem nullt ad ures bufferre.", b.removeFirst() == null);

        b.append(p1);
        check("Buffer.isEmpty(): a buffer ures egy elem hozzaadasa utan.", !b.isEmpty());
        check("Buffer.isFull(): a buffer teli, pedig van meg hely.", !b.isFull());
        b.append(p2);

        Packet first = b.removeFirst();
        check("Buffer.removeFirst(): null-t adott, pedig nem ures.", first != null);
        check("Buffer.removeFirst(): rossz sorrendben adja az elemeket.", p1 == first);

        check("Buffer.removeFirst(): null-t adott, pedig nem ures. (2)", b.removeFirst() != null);

        check("Buffer.isEmpty(): hamisat adott, pedig ures.", b.isEmpty());
        check("Buffer.isFull(): igazat adott, pedig ures.", !b.isFull());

        b.append(p1);
        b.append(p2);
        b.append(p3);
        check("Buffer.isEmpty(): igazat adott, pedig teli.", !b.isEmpty());
        check("Buffer.isFull(): hamisat adott, pedig teli.", b.isFull());

        first = b.removeFirst();
        check("Buffer.removeFirst(): null-t adott, pedig nem ures (3).", first != null);
        check("Buffer.removeFirst(): rossz sorrendben adja az elemeket (2).", p1 == first);

        first = b.removeFirst();
        check("Buffer.removeFirst(): null-t adott, pedig nem ures (4).", first != null);
        check("Buffer.removeFirst(): rossz sorrendben adja az elemeket (3).", p2 == first);

        first = b.removeFirst();
        check("Buffer.removeFirst(): null-t adott, pedig nem ures (5).", first != null);
        check("Buffer.removeFirst(): rossz sorrendben adja az elemeket (4).", p3 == first);
        
    }

    public String description() { return "router.Buffer"; }
    public String className() { return "router.Buffer"; }

    public Object[] expectedMethods() throws Exception {
        return new Object[]
        { constructor(className(), Integer.TYPE)
        , method(className() + ".isEmpty")
        , method(className() + ".isFull")
        , method(className() + ".append", Packet.class)
        , method(className() + ".removeFirst")
        };
    }

    public Object[] expectedFields() throws Exception {
        return new Object[] {};
    }

    public static void main(String... args) {
        Test.main(new BufferTest());
    }
}
