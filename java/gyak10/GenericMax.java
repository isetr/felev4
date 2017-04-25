import java.util.Collection;
import java.util.Iterator;

class GenericMax {
    public static <T extends Comparable<T>> T max(Collection<T> elems) {
        Iterator<T> it = elems.iterator();
        if(it.hasNext()) {
            T maximum = it.next();
            while(it.hasNext()) {
                T elem = it.next();
                if(maximum.compareTo(elem) < 0){
                    maximum = elem;
                }
            }
            return maximum;
        }
        return null;
    }
}