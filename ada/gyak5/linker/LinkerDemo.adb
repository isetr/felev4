with Linker, Ada.Text_IO;
use Ada.Text_IO;

procedure LinkerDemo is

    type Index is new Integer;
    type Elem is new Integer;
	type Tömb is array (Index range <>) of Elem;

	function F (E: Elem) return Boolean is
	begin
		return E < 0;
	end F;

	procedure KeresNegativ is new Linker(Elem, Index, Tömb, F);

	X: Tömb := (3,2,-5,7,1);
	L: Boolean;
	E: Index;
begin
	KeresNegativ(X, L, E);
	if L then
		Put(Index'Image(E));
	else
		Put("Nincs ilyen elem");
	end if;

end LinkerDemo;
