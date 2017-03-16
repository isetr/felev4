generic
	type Elem is private;
	type Index is (<>);
	type Tomb is array ( Index range <> ) of elem;
	with procedure Swap (E1: in out Elem; E2: in out Elem);
	
procedure Reversal( T: in out Tomb );