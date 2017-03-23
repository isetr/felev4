with Ada.Text_IO, Has_Repetition;
use Ada.Text_IO;

procedure Demo is
	type Index is new Positive;
	type Item is new Character;
	
	function Has_Double_Letters is new Has_Repetition(Character, Positive, String);
	
	X: String := "Valami";
	X2: String := "Valammi";
begin
	if not Has_Double_Letters(X) then
		Put_Line("Jo");
	else
		Put_Line("Rossz");
	end if;
	
	if Has_Double_Letters(X2) then
		Put_Line("Jo");
	else
		Put_Line("Rossz");
	end if;
	
	if Has_Double_Letters("aadfg") then
		Put_Line("Jo");
	else
		Put_Line("Rossz");
	end if;
	
	if Has_Double_Letters("dfgaa") then
		Put_Line("Jo");
	else
		Put_Line("Rossz");
	end if;
	
	if not Has_Double_Letters("") then
		Put_Line("Jo");
	else
		Put_Line("Rossz");
	end if;
end Demo;