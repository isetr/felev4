procedure Sort(T: in out Item_Array) is
    Tmp: Item;
begin
    for I in reverse Index'Succ(T'First)..T'Last loop
        for J in T'First..Index'Pred(I) loop
            if T(J) < T(Index'Succ(J)) then
                Tmp := T(J);
                T(J) := T(Index'Succ(J));
                T(Index'Succ(J)) := Tmp;
            end if;
        end loop;
    end loop;
end;