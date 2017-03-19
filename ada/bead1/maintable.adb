with Ada.Text_IO, Tables;
use Ada.Text_IO;

procedure maintable is

    function TestTables return Boolean is
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
    begin
        return People_Tables_Test;
    end TestTables;

begin
    if not TestTables then
        Put_Line("Megbukott a teszteken :-( ");
    else
        Put_Line("Átment a teszteken :-) ");   
    end if;
end maintable;