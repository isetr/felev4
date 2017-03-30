procedure Migrate(G: in out Grid; Max: Natural) is

	function Find_New(G: Grind; Max: Natural; I, J: in out Index) return Boolean is
	begin
		if I > G'Range(1)'Frist then
			I := Index'Pred(I);
			if G(I, J) < Max then
				return True;
			end if;
			
		end if;
		
		-- I DON'T KNOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOW
		
		return False;
	end Find_New;

	procedure Move(G: in out Grid; I, J, Max: Natural) is
		New_I: Natural := I;
		New_J: Natural := J;
		Tmp: Natural;
	begin
		Tmp := G(I, J) - Max;
		if Find_New(G, Max, New_I, New_J) then
			G(I, J) := Max;
			if Tmp < (Max - G(New_I, New_J)) then
				G(New_I, New_J) := G(New_I, New_J) + Tmp;
			else 
				G(New_I, New_J) := Max;
			end if;
		end if;
	end Move;
	
begin
	for I in G'Range(1) loop
		for J in G'Range(2) loop
			if G(I, J) > Max then
				Move(G, I, J, Max);
			end if;
		end loop;
	end loop;
end;