with Ada.Text_IO, Sort;
use Ada.Text_IO;

procedure mainsort is

    function TestSort return Boolean is
        type Int_Array is array(Positive range<>) of Integer;

        function Asc(A,B : in Integer) return Boolean is (A > B);
        function Desc(A,B : in Integer) return Boolean is (A < B);

        procedure Sort_Asc is new Sort(Item=>Integer, Index=>Positive, Item_Array=>Int_Array,"<"=>Asc);
        procedure Sort_Desc is new Sort(Item=>Integer, Index=>Positive, Item_Array=>Int_Array,"<"=>Desc);
        Int_Array_First : Int_Array := (3,6,4,2,7,8,1);
        Int_Array_Second : Int_Array := (2,4,3,2,2,5);

        Int_Array_First_Asc : Int_Array := (1,2,3,4,6,7,8);
        Int_Array_First_Desc : Int_Array := (8,7,6,4,3,2,1);
        Int_Array_Second_Asc : Int_Array := (2,2,2,3,4,5);
        Int_Array_Second_Desc : Int_Array := (5,4,3,2,2,2);

        function Correct(
            SortT : access procedure (A: in out Int_Array);
            Input: in out Int_Array;
            Output: in Int_Array
        ) return Boolean
        is
        begin
            SortT(Input);
            for I in Input'Range loop
                if Input(I) /= Output(I) then
                    return false;
                end if;
            end loop;
            return true;
        exception
            when others => return false;
        end Correct;
    begin
        return
            Correct(Sort_Asc'Access, Int_Array_First,Int_Array_First_Asc) and then
            Correct(Sort_Desc'Access, Int_Array_First,Int_Array_First_Desc) and then
            Correct(Sort_Asc'Access, Int_Array_Second,Int_Array_Second_Asc) and then
            Correct(Sort_Desc'Access, Int_Array_Second, Int_Array_Second_Desc);
    end TestSort;

begin
    if not TestSort then
        Put_Line("Megbukott a teszteken :-( ");
    else
        Put_Line("Átment a teszteken :-) ");   
    end if;
end mainsort;