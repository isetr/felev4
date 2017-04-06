with Ada.Text_IO, Queues;
use Ada.Text_IO;

procedure Demo is
	package Nat_Queue is new Queues(Natural); use Nat_Queue;
	
	A: Queue(10);
	
	procedure Test_N (L, R: Natural) is
	begin
		if L = R then
			Put_Line("OK");
		else
			Put_Line("FAIL");
		end if;
	end Test_N;
	
	procedure Test_B (L, R: Boolean) is
	begin
		if L = R then
			Put_Line("OK");
		else
			Put_Line("FAIL");
		end if;
	end Test_B;
	
begin
	Test_B(Is_Full(A), False);
	Test_B(Is_Empty(A), True);
	Put(A, 10);
	Test_B(Is_Full(A), False);
	Test_B(Is_Empty(A), False);
	Test_N(Pop(A), 10);
	Test_B(Is_Full(A), False);
	Test_B(Is_Empty(A), True);
	for I in 1..10 loop
		Put(A, I);
	end loop;
	Test_B(Is_Full(A), True);
	Test_B(Is_Empty(A), False);
	
end Demo;