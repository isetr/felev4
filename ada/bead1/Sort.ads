generic
    type Item is private;
    type Index is (<>);
    type Item_Array is array (Index range <>) of Item;
    
    with function "<" (L, R: Item) return Boolean is <>;

procedure Sort(T: in out Item_Array);