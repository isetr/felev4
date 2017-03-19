with Ada.Text_IO, Tables, Sort;
use Ada.Text_IO;

procedure mainFull is

    function TestFull return Boolean is
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

        type People is record
            Kor : Integer;
            Money : Integer;
        end record; 
        type People_Array is array(Positive range<>) of People;

        package People_Tables is new Tables(People, People_Array);
        People_1 : People_Tables.Table(1);
        People_5 : People_Tables.Table(5);
        People_Temp : People_Array(1..5);
        function People_Tables_Test return Boolean is
            exc_count : Integer := 0;
        begin
            for I in Positive range 1..5 loop
                begin
                    People_Tables.Insert(People_5,(Kor=>I*3+5,Money=>I*200+10000));
                    People_Temp := People_Tables.getTable(People_5);
                    for J in Positive range 1..I loop
                        if People_Temp(J).Kor /= J*3+5 or People_Temp(J).Money /= J*200+10000 then
                            return false;
                        end if;
                    end loop;
                exception
                    when People_Tables.Table_Insert_Error => return false;
                end;
            end loop;
            People_Tables.Insert(People_1,(Kor=>3+5,Money=>200+10000));
            begin
                People_Tables.Insert(People_1,(Kor=>3+5,Money=>200+10000));
                return false;
            exception
                when People_Tables.Table_Insert_Error => exc_count := exc_count + 1;
            end;
            if exc_count /= 1 then 
                return false;
            end if;
            return true;
        end People_Tables_Test;
        function op1(A : in People) return Boolean is begin return A.Money >= 10400; end;
        function op2(A : in People) return Boolean is begin return A.Kor <= 14; end;
        function op3(A,B : in People) return Boolean is begin return A.Kor < B.Kor; end;
        function People_Where_Test return Boolean is
            procedure Where1 is new People_Tables.Where(op1);
            procedure Where2 is new People_Tables.Where(op2);
            procedure Sort1 is new People_Tables.Sort_Table(op3);
            Temp : Natural;
            People_Temp_1 : People_Array(1..4);
            People_Temp_2 : People_Array(1..3);
            People_Temp_3 : People_Array(1..2);
        begin
            if not People_Tables_Test then
                return False;
            end if;
            if People_Tables.Size(People_5) /= 5 then
                return false;
            end if;
            Where1(People_5, People_Temp_1,Temp);
            if Temp /= 4 then
                return false;
            end if;
            for I in Positive range 1..4 loop
                if People_Temp_1(I).Kor /= (I+1)*3+5 or People_Temp_1(I).Money /= (I+1)*200+10000 then
                    return false;
                end if;
            end loop;
            Where2(People_5, People_Temp_2,Temp);
            if Temp /= 3 then
                return false;
            end if;
            for I in Positive range 1..3 loop
                if People_Temp_2(I).Kor /= I*3+5 or People_Temp_2(I).Money /= I*200+10000 then
                    return false;
                end if;
            end loop;
            Where2(People_5, People_Temp_3,Temp);
            if Temp /= 3 then
                return false;
            end if;
            Sort1(People_5);
            People_Temp := People_Tables.getTable(People_5);
            for I in Positive range 1..5 loop
                if People_Temp(I).Kor /= 23-I*3 then
                    return false;
                end if;
            end loop;
            return true;
        end People_Where_Test;
    begin
        return
            Correct(Sort_Asc'Access, Int_Array_First,Int_Array_First_Asc) and then
            Correct(Sort_Desc'Access, Int_Array_First,Int_Array_First_Desc) and then
            Correct(Sort_Asc'Access, Int_Array_Second,Int_Array_Second_Asc) and then
            Correct(Sort_Desc'Access, Int_Array_Second, Int_Array_Second_Desc) and then
            People_Where_Test;
    end TestFull;

begin
    if not TestFull then
        Put_Line("Megbukott a teszteken :-( ");
    else
        Put_Line("Átment a teszteken :-) ");   
    end if;
end mainfull;