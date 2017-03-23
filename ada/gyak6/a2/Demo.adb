with Ada.Text_IO, Most_Frequent;
use Ada.Text_IO;

procedure Demo is
	function Most_Character is new Most_Frequent(Positive, Character, String);
	
	procedure Test(S: String; E: Character) is
	begin
		if Most_Character(S) = E then
		Put_Line("Correct answer");
		else
			Put_Line("Wrong Answer");
		end if;
	end Test;
begin
	Test("aaaaaa", 'a');
	Test("aabbbb", 'b');
	Test("aaaabb", 'a');
	Test("a", 'a');
	Test("aabbbcc", 'b');
end Demo;