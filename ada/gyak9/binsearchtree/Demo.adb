with Ada.Text_IO, BinSearchTrees;
use Ada.Text_IO;

procedure Demo is
	package I_BinSearchTrees is new BinSearchTrees(Integer);
	use I_BinSearchTrees;
	
	type IArray is array (Positive range <>) of Integer;
	
	procedure Put_InOrder(T: BinSearchTree) is
	begin
		if not Is_Empty(T) then
			if not Is_Empty(Get_Left(T)) then
				Put_InOrder(Get_Left(T));
			end if;
			
			Put(Integer'Image(Get_Root(T)));
			
			if not Is_Empty(Get_Right(T)) then
				Put_InOrder(Get_Right(T));
			end if;
		end if;
	end Put_InOrder;
	
	T: BinSearchTree := Empty;
	A: IArray := (1, 4, 2, 10, 3, 7);
begin
	for I in A'Range loop
		Add(T, A(I));
	end loop;
	Put_InOrder(T);
end Demo;