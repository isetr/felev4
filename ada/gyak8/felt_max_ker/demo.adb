with Ada.Text_IO, Felt_Max_Ker;
use Ada.Text_IO;

procedure Demo is
	type IArray is array (Positive range <>) of Integer;
	
	function Negative(E: Integer) return Boolean is
	begin
		return E < 0;
	end;	
	
	procedure FeltMax is new Felt_Max_Ker(Integer, Positive, IArray, Negative);
	
	A: IArray := (1, 2, 10, 100, -5, -2, 30, 0, -50);
	L: Boolean;
	Max_I: Positive;
begin
	FeltMax(A, L, Max_I);
	if L then
		Put_Line(Integer'Image(A(Max_I)));
	else
		Put_Line("fuk");
	end if;
end Demo;