package Racionalisok is

    type Racionalis is private;

    function Szamalalo ( R: Racionalis ) return Integer;
    function Nevezo ( R: Racionalis ) return Positive;

    function "/" ( Szamalalo: Integer; Nevezo: Positive ) return Racionalis;
    function "/" ( X, Y: Racionalis ) return Racionalis;
    function "/" ( X: Racionalis; Y: Positive ) return Racionalis;

   -- function "=" ( X, Y: Racionális ) return Boolean;
    function "+" ( X: Racionalis; Y: Racionalis) return Racionalis;

private

    type Racionalis is record
                           Szamalalo: Integer := 0;
                           Nevezo: Positive := 1;
                       end record;

end Racionalisok;
