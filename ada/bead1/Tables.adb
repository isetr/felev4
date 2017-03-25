with Sort;

package body Tables is

    function Size(T: Table) return Integer is
    begin
        return T.Items_Num;
    end Size;

    function Get_Table(T: Table) return Item_Array is
    begin
        return T.Items;
    end Get_Table;

    procedure Insert(T: in out Table; E: Item) is
    begin
        if T.Items_Num > T.Capacity then
            raise Table_Insert_Error;
        else
            T.Items_Num := T.Items_Num + 1;
            T.Items(T.Items_Num) := E;
        end if;
        exception
            when Constraint_Error => raise Table_Insert_Error;
    end Insert;

    procedure Where(T: Table; A: out Item_Array; N: out Natural) is
        Ind: Positive := 1;
    begin
        N := 0;
        for I in T.Items'Range loop
            if Pred(T.Items(I)) then
                if Ind <= A'Last then
                    A(Ind) := T.Items(I);
                    Ind := Ind + 1;
                end if;
                N := N + 1;
            end if;
        end loop;
    end Where;

    procedure Sort_Table(T: in out Table) is
        procedure Curr_Sort is new Sort(Item, Positive, Item_Array, "<");
    begin
        Curr_Sort(T.Items);
    end Sort_Table;
    
end Tables;