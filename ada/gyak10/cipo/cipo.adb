with Ada.Text_IO;
use Ada.Text_IO;

procedure Cipo is

	task Por is
		entry Bal_Lep;
		entry Jobb_Lep;
	end Por;
	
	task body Por is
	begin
		for I in 1..10 loop
			Put_Line(Integer'Image(I));
			accept Bal_Lep do
				Put_Line("Bal: Lep.");
			end Bal_Lep;
			accept Jobb_Lep do
				Put_Line("Jobb: Lep.");
			end Jobb_Lep;
		end loop;
	end;
	
	task type Bal_Cipo;
	task body Bal_Cipo is
	begin
		loop
			select
				Por.Bal_Lep;
			else
				Put_Line("Bal: Pihen.");
				delay 1.0;
			end select;
		end loop;
	exception 
		when Tasking_Error => Put_Line("Bal: Megall.");
	end Bal_Cipo;
	
	task type Jobb_Cipo;
	task body Jobb_Cipo is
	begin
		loop
			select
				Por.Jobb_Lep;
			else
				Put_Line("Jobb: Pihen.");
				delay 1.0;
			end select;
		end loop;
	exception 
		when Tasking_Error => Put_Line("Jobb: Megall.");
	end Jobb_Cipo;
	
	J: Jobb_Cipo;
	B: Bal_Cipo;
begin
	null;
end Cipo;