function Most_Frequent (X: Vector) return Item is

	function Multiplicity(E: Item) return Integer is
		Tmp: Integer := 0;
	begin
		for I in X'Range loop
			if E = X(I) then
				Tmp := Tmp + 1;
			end if;
		end loop;
		
		return Tmp;
	end Multiplicity;
	
	MaxI: Integer := Multiplicity(X(X'First));
	Max: Item := X(X'first);
begin
	for I in Index'Succ(X'First)..X'Last loop
		if MaxI < Multiplicity(X(I)) then
			MaxI := Multiplicity(X(I));
			Max := X(I);
		end if;
	end loop;
	return Max;
end Most_Frequent;