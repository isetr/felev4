with Reversal, Ada.Text_IO;
use Ada.Text_IO;

procedure ReversalDemo is
	type Elem is new Integer;
	type Index is new Integer;
	type Tomb is array (Index range <>) of Elem;
	
	procedure IntSwap(E1: in out Elem; E2: in out Elem) is
		Tmp: Elem;
	begin
		Tmp := E1;
		E1 := E2;
		E2 := Tmp;
	end IntSwap;
	
	procedure IntReversal is new Reversal (Elem, Index, Tomb, IntSwap);

	X: Tomb := (3,2,5,7,1);
begin
	IntReversal( X );
	for I in X'Range loop
		Put(Elem'Image(X(I)));
	end loop;
end ReversalDemo;