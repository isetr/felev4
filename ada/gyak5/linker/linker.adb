procedure Linker ( T: Tömb; L: out Boolean; E: out Index ) is
begin
	L := False;
	for I in reverse T'Range loop
		if Op(T(I)) then 
			E := I;
			L := True;
		end if;
	end loop;
end Linker;
