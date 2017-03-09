generic
   type Elem is private;
   type Elem2 is private;
    type Index is (<>);
   type Tömb is array ( Index range <> ) of Elem;
   type Tömb2 is array ( Index range <> ) of Elem2;
    with function Op( A: Elem ) return Elem2;

function Map ( T: Tömb ) return Tömb2;
