function Count(G: Grid) return Natural is
	Tmp: Natural := 0;
begin
	for I in G'Range(1) loop
		for J in G'Range(2) loop
			Tmp := Tmp + G(I,J);
		end loop;
	end loop;
	return Tmp;
end Count;