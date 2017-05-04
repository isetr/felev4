with Ada.Text_IO;
use Ada.Text_IO;

procedure Csirke is
	task Csirke is
		entry Etet;
		entry Jatszik;
	end Csirke;

	task body Csirke is
		Mag: Natural := 4;
		exception MEGPUSZTULOK;
	begin
		while Mag < 30 and Mag > 0 loop
			select
				accept Etet do
					Mag := Mag + 3;
					Put_Line("Etet: magok szama(" & Natural'Image(Mag) & ")");
				end Etet;
			or
				accept Jatszik do
					Put_Line("Jatszik:");
				end Jatszik;
			else
				raise MEGPUSZTULOK;
			end select;
		end loop;
		
	end Csirke;

begin

end;