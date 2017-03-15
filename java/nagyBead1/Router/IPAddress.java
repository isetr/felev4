package Router;

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
            l = l && ip[i] == toComp.ip[i];
        }
        return true;
    }

    public boolean insideRng(IPAddress ip1, IPAddress ip2) {
        boolean l = true;
        if(ip[0] >= ip1.ip[0] && ip[0] <= ip2.ip[0]) {
            if(ip[1] >= ip1.ip[1] && ip[1] <= ip2.ip[1]) {
                if(ip[2] >= ip1.ip[2] && ip[2] <= ip2.ip[2]) {
                    if(ip[3] >= ip1.ip[3] && ip[3] <= ip2.ip[3]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public String toString() {
        return ip[0] + "." + ip[1] + "." + ip[2] + "." + ip[3];
    }
}