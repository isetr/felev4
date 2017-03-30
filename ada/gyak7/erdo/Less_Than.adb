function Less_Than(G: Grid; Max: Natural) return Boolean is
	Tmp: Natural := 0;
begin
	for I in G'Range(1) loop
		for J in G'Range(2) loop
			Tmp := Tmp + G(I,J);
			if Tmp > Max then
				return True;
			end if;
		end loop;
	end loop;
	return False;
end Less_Than;