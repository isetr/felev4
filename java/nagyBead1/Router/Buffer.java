package Router;

public class Buffer {
    Packet[] packets;
    int firstIndex;
    int packetsNum;

    public Buffer(int num) {
        packets = new Packet[num];
        firstIndex = 0;
        packetsNum = 0;
    }

    public boolean isEmpty() {
        return packetsNum == 0;
    }

    public boolean isFull() {
        return packetsNum == packets.length;
    }

    public void append(Packet pck) {
        if(!isFull()) {
            packets[(firstIndex + packetsNum) % packets.length] = pck;
            ++packetsNum;
        }
    }

    public Packet removeFirst() {
        if(!isEmpty()){
            Packet tmp = packets[firstIndex];
            packets[firstIndex] = null;
            ++firstIndex;
            --packetsNum;
            return tmp;
        }
        return null;
    }
}