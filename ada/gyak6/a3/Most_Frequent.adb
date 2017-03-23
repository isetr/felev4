function Most_Frequent (X: Vector) return Item is
	Multiplicity: array(X'Range) of Integer;

	Tmp: Integer := 0;
	
	MaxI: Index := Multiplicity'First;
	Max: Integer;
begin
	
	for I in Multiplicity'Range loop
		Tmp := 0;
		for J in reverse Multiplicity'First..Index'Pred(I) loop
			if X(I) = X(J) then
				Tmp := Tmp + 1;
			end if;
		end loop;
		Multiplicity(I) := Tmp + 1;
	end loop;
	
	Max := Multiplicity(MaxI);
	
	for I in Multiplicity'Range loop
		if Max < Multiplicity(I) then
			Max := Multiplicity(I);
			MaxI := I;
		end if;
	end loop;
	return X(MaxI);
end Most_Frequent;