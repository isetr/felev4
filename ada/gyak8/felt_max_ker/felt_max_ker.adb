procedure Felt_Max_Ker(A: I_Array; L: out Boolean; Max_I: out Index) is
begin
	L := False;

	for I in A'Range loop
		if not L and then Pred(A(I)) then
			Max_I := I;
			L := True;
		elsif L and then Pred(A(I)) then
			if A(Max_I) < A(I) then
				Max_I := I;
			end if;
		end if;
	end loop;
end Felt_Max_Ker;