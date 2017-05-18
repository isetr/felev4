with Ada.Text_IO, tools, hauntedhouse, Writer;
use Ada.Text_IO, tools, hauntedhouse, Writer;

procedure House is
	type Duration_Access is access Duration;

	task Princess is
		entry Scare(Ghost_Pos: Position);
	end Princess;
	
	task type Ghost(Id: Positive; To_Wait: Duration_Access);
	
	task type Wizard(To_Summon: Positive; Summon_Duration: Duration_Access);
	type Ghost_Access is access Ghost;
	
	type Direction is (North, South, East, West);
	package Random_Direction is new Random_Generator(Direction);
	
	task body Princess is
		Pos: Position := (1, 3);
		Health: Natural := 3;
		Dir: Direction := Random_Direction.GetRandom;
		To_Move: Position := Pos;
		
		function Try_Move(To_Dir: in out Direction) return Boolean is
		begin
			To_Dir := Random_Direction.GetRandom;
			To_Move := Pos;
			if To_Dir = North then To_Move.x := To_Move.x + 1; end if;
			if To_Dir = South then To_Move.x := To_Move.x - 1; end if;
			if To_Dir = East then To_Move.y := To_Move.y + 1; end if;
			if To_Dir = West then To_Move.y := To_Move.y - 1; end if;
			return isCorrect(To_Move);
		end Try_Move;
	begin
		while Health > 0 loop
			select
				when GetField(Pos) = C =>
					accept Scare(Ghost_Pos: Position) do
						if Ghost_Pos.x = Pos.x and then Ghost_Pos.y = Pos.y then
							Health := Health - 1;
							Write_Line.Put("Princess: Oh poi o.o (Health: " & Natural'Image(Health) & ")");
						else 
							Write_Line.Put("Princess: Dat poi is scary somewhere.");
						end if;
					end Scare;
			else
				delay 1.0;
				while not Try_Move(Dir) loop
					null;
				end loop;
				Pos := To_Move;
				if GetField(Pos) = E then
					Write_Line.Put("Princess: I'm out. *drops the mic*");
					abort Princess;
				end if;
			end select;
		end loop;
		Write_Line.Put("Princess: So dead, rekt by ghosts :(");
	end Princess;
	
	task body Ghost is
		Pos: Position := GetRandPos;
	begin
		while Princess'Callable loop
			Pos := GetRandPos;
			Princess.Scare(Pos);
			Write_Line.Put("Ghost: huuu huuuuu my position is (" & Natural'Image(Pos.x) & ", " & Natural'Image(Pos.y) & ").");
			delay To_Wait.all;
		end loop;
	end Ghost;
	
	task body Wizard is
		Summoned: Positive := 1;
		Wand: Ghost_Access;
	begin
		while Summoned < To_Summon loop
			delay Summon_Duration.all;
			Wand := new Ghost(Summoned, new Duration'(Summon_Duration.all * Summoned));
			Summoned := Summoned + 1;
		end loop;
	end Wizard;
	
	Kartoffel: Wizard(5, new Duration'(0.2));
begin
	null;
end House;