with Ada.Text_IO, Fifos;
use Ada.Text_IO;

procedure Demo is
	package I_Fifo is new Fifos(Integer);
	use I_Fifo;
	
	Q: Fifo;
begin
	Push(Q, 1);
	Push(Q, 2);
	Push(Q, 3);
	Push(Q, 4);
	Push(Q, 5);
	while not Is_Empty(Q) loop
		Put(Integer'Image(Pop(Q)));
	end loop;
end Demo;