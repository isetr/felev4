generic 
	type Item is private;
	type Index is (<>);
	type I_Array is array (Index range <>) of Item;
	
	with function Pred(E: Item) return Boolean;
	with function "<" (L, R: Item) return Boolean is <>;
	
procedure Felt_Max_Ker(A: I_Array; L: out Boolean; Max_I: out Index);