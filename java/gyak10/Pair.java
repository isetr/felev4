class Pair<F,S> {
    private F fst;
    private S snd;

    public Pair(F fst, S snd) {
        this.fst = fst;
        this.snd = snd;
    }

    public F getFirst() {
        return fst;
    }

    public S getSecond() {
        return snd;
    }

    public void setFirst(F fst) {
        this.fst = fst;
    }

    public void setSecond(S snd) {
        this.snd = snd;
    }
}