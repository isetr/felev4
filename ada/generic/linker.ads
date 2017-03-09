generic
    type Elem is private;
    type Index is (<>);
    type Tömb is array ( Index range <> ) of Elem;
    with function Op( A: Elem ) return Boolean;

function Linker ( T: Tömb ) return Index;
