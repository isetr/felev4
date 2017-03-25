generic
    type Item is private;
    type Item_Array is array (Positive range <>) of Item;
    
package Tables is
    type Table (Capacity: Integer) is limited private;

    Table_Insert_Error : exception;

    function Size(T: Table) return Integer;

    function Get_Table(T: Table) return Item_Array;

    procedure Insert(T: in out Table; E: Item);

generic 
    with function Pred(E: Item) return Boolean;

procedure Where(T: Table; A: out Item_Array; N: out Natural);

generic
    with function "<"(L, R: Item) return Boolean is <>;

procedure Sort_Table(T: in out Table);

private
    type Table(Capacity: Integer) is record
                                        Items: Item_Array(1..Capacity);
                                        Items_Num: Integer := 0;
                                    end record;
end Tables;