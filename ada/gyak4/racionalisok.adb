with Lnko;

package body Racionalisok is

    function Szamlalo ( R: Racionalis ) return Integer is
    begin
        return R.Szamlalo;
    end;

    function Nevezo ( R: Racionalis ) return Positive is
    begin
        return R.Nevezo;
    end;

    function Normalizalva ( Szamlalo: Integer; Nevezo: Positive )
    return Racionalis is
    begin
        if Szamlalo = 0 then
            return (0,1);
        else
            declare
            lnkok : Positive := lnko(Szamlalo, Nevezo);
            begin
            return (Szamlalo / lnkok, Nevezo /lnkok);
            end;
        end if;
    end;

    function "/" ( X, Y: Racionalis ) return Racionalis is
    begin
      return Normalizalva ( X.Szamalalo * Y.Nevezo, X.Nevezo * Y.Szamalalo);
    end;

    function "/" ( X: Racionalis; Y: Positive ) return Racionalis is
    begin
      return Normalizalva (X.Szamalalo, X.Nevezo);
    end;

    function "+" ( X: Racionalis; Y: Racionalis) return Racionalis is
    begin
      return Normalizalva (X.Szamlalo * Y.Nevezo + Y.Szamalalo * X.Nevezo, X.Szamalalo * Y.Szamalalo);
    end;

end Racionalisok;
