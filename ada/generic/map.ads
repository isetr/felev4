generic
   type Elem is private;
   type Elem2 is private;
    type Index is (<>);
   type T�mb is array ( Index range <> ) of Elem;
   type T�mb2 is array ( Index range <> ) of Elem2;
    with function Op( A: Elem ) return Elem2;

function Map ( T: T�mb ) return T�mb2;
