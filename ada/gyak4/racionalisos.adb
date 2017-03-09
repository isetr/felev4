with Racionalisok, Ada.Integer_Text_IO, Ada.Text_IO;
use Racionalisok, Ada.Integer_Text_IO, Ada.Text_IO;

procedure Racionalisos is

    R: Racionalis := 4/8;
    -- X: Racionális := 3/4/5;

begin

    R := R / (R/2);
    Put( Szamalalo(R) );
    Put( '/' );
    Put( Nevezo(R) );

end;
