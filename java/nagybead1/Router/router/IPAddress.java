package router;

import java.util.Arrays;

public class IPAddress {
    private int[] ip;
    public IPAddress(int[] ip) {
        this.ip = Arrays.copyOf(ip, 4);
    }

    public static IPAddress fromString(String ipString) {
        String[] tmp = ipString.split("\\.");
        if(tmp.length != 4) return null;

        int[] tmpIp = new int[4];
        for(int i = 0; i < 4; ++i) tmpIp[i] = Integer.parseInt(tmp[i]);

        return new IPAddress(tmpIp);
    }

    public boolean isTheSame(IPAddress toComp) {
        boolean l = true;
        for(int i = 0; i < 4; ++i){
            l = l && (ip[i] == toComp.ip[i]);
        }
        return l;
    }

    public boolean insideRng(IPAddress ip1, IPAddress ip2) {
        if(ip1.toString().compareTo(ip2.toString()) > 0) {
            IPAddress tmp = ip1;
            ip1 = ip2;
            ip2 = tmp;
        }

        if(this.toString().compareTo(ip1.toString()) >= 0 && this.toString().compareTo(ip2.toString()) <= 0) return true;
        return false;
    }

    public String toString() {
        return ip[0] + "." + ip[1] + "." + ip[2] + "." + ip[3];
    }
}