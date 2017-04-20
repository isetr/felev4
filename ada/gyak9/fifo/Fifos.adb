package body Fifos is
	function Is_Empty(F: Fifo) return Boolean is
	begin
		return F.Items = 0;
	end Is_Empty;
	
	function Is_Full(F: Fifo) return Boolean is
	begin
		return False;
	end Is_Full;
	
	function Size(F: Fifo) return Natural is
	begin
		return F.Items;
	end Size;
	
	procedure Push(F: in out Fifo; E: Item) is
	begin
		F.Head := new Node'(E, F.Head);
		F.Items := F.Items + 1;
	end Push;
	
	function Pop(F: in out Fifo) return Item is
		Tmp: Item;
	begin
		if Is_Empty(F) then
			raise Empty_Fifo;
		else
			Tmp := F.Head.Value;
			F.Head := F.Head.Next;
			F.Items := F.Items - 1;
			return Tmp;
		end if;
	end Pop;
end Fifos;