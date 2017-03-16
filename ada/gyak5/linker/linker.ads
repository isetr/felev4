generic
	type Elem is private;
    type Index is (<>);
    type Tömb is array ( Index range <> ) of Elem;
    with function Op( A: Elem ) return Boolean;

procedure Linker ( T: Tömb; L: out Boolean; E: out Index );
