generic 
	type Item is private;
package Fifos is
	type Fifo is limited private;
	
	Empty_Fifo: Exception;
	
	function Is_Empty(F: Fifo) return Boolean;
	function Is_Full(F: Fifo) return Boolean;
	function Size(F: Fifo) return Natural;
	procedure Push(F: in out Fifo; E: Item);
	function Pop(F: in out Fifo) return Item;	
	
private
	type Node;
	type Pointer is access Node;
	type Node is record
		Value: Item;
		Next: Pointer := null;
	end record;
	type Fifo is record
		Items: Natural := 0;
		Head: Pointer := null;
	end record;
end Fifos;