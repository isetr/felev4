package body Queues is
	
	function Is_Empty(Q: Queue) return Boolean is
	begin
		return Q.Item_Num = 0;
	end Is_Empty;
	
	function Is_Full(Q: Queue) return Boolean is
	begin
		return Q.Item_Num = Q.Capacity;
	end Is_Full;

	procedure Put(Q: in out Queue; E: Item) is
	begin
		if Is_Full(Q) then
			raise Queue_Insert_Error;
		else
			Q.Item_Array((Q.Current_Index + Q.Item_Num) mod Q.Capacity) := E;
			Q.Item_Num := Q.Item_Num + 1;
		end if;
	end Put;
	
	function Pop(Q: in out Queue) return Item is
		Tmp: Item;
	begin
		if Is_Empty(Q) then
			raise Queue_Remove_Error;
		else
			Tmp := Q.Item_Array(Q.Current_Index);
			Q.Current_Index := (Q.Current_Index + 1) mod Q.Capacity;
			Q.Item_Num := Q.Item_Num - 1;
			return Tmp;
		end if;
	end Pop;	

end Queues;