generic
    type Elem is private;
    type Index is (<>);
    type T�mb is array ( Index range <> ) of Elem;
    with function Op( A: Elem ) return Boolean;

function Linker ( T: T�mb ) return Index;
