with Ada.Text_IO, Count, Less_Than, Count_Value;
use Ada.Text_IO;

procedure Demo is
	type Grid_I is array (Integer range <>, Integer range <>) of Natural;
	function Count_I is new Count(Integer, Grid_I);
	function Less_Than_I is new Less_Than(Integer, Grid_I);
	
	function More_Than_3(E: Integer) return Boolean is
	begin
		return E > 3;
	end More_Than_3;
	
	function Count_Value_I is new Count_Value(Integer, Natural, Grid_I, More_Than_3);
	
	G1: Grid_I := ((0,0,0,0,0,0,0,0,0,0)
				  ,(0,1,0,0,0,0,0,0,0,0)
				  ,(0,0,0,0,0,0,0,0,0,0)
				  ,(0,0,0,0,0,0,1,0,0,0)
				  ,(0,0,0,1,0,0,0,0,0,0)
				  ,(0,0,0,0,0,0,0,0,0,0)
				  ,(0,0,0,0,0,1,0,0,0,0)
				  ,(0,0,0,0,0,0,0,0,0,1)
				  ,(1,0,0,0,0,0,0,0,0,0)
				  ,(0,0,0,1,0,0,0,0,0,0));
				  
	G2: Grid_I := ((0,0,0,0,0,0,0,0,0,0)
				  ,(0,8,0,0,0,0,0,0,0,0)
				  ,(0,0,0,0,0,0,0,0,0,0)
				  ,(0,0,0,0,0,0,1,0,0,0)
				  ,(0,0,0,1,0,0,0,0,0,0)
				  ,(0,0,0,0,0,0,0,0,0,0)
				  ,(0,0,0,0,0,8,0,0,0,0)
				  ,(0,0,0,0,0,0,0,0,0,1)
				  ,(1,0,0,0,0,0,0,0,0,0)
				  ,(0,0,0,1,0,0,0,0,0,0));
				  
	procedure Test_N (L, R: Natural) is
	begin
		if L = R then
			Put_Line("OK");
		else
			Put_Line("FAIL");
		end if;
	end Test_N;
	
	procedure Test_B (L, R: Boolean) is
	begin
		if L = R then
			Put_Line("OK");
		else
			Put_Line("FAIL");
		end if;
	end Test_B;

begin
	Test_N(Count_I(G1), 7);
	Test_B(Less_Than_I(G1, 10), False);
	Test_B(Less_Than_I(G1, 5), True);
	Test_N(Count_Value_I(G1), 0);
	Test_N(Count_Value_I(G2), 2);
end Demo;