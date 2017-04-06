generic
	type Item is private;
	
package Queues is
	
	type Queue(Capacity: Natural) is limited private;
	
	Queue_Insert_Error : Exception;
	Queue_Remove_Error : Exception;
	
	
	function Is_Empty(Q: Queue) return Boolean;
	
	function Is_Full(Q: Queue) return Boolean;
	
	procedure Put(Q: in out Queue; E: Item);
	
	function Pop(Q: in out Queue) return Item;
	
private
	type I_Array is array (Natural range <>) of Item;
	type Queue(Capacity: Natural) is record
			Item_Array: I_Array(0..Capacity);
			Item_Num: Natural := 0;
			Current_Index: Natural := 0;
		end record;
	
end Queues;