package body BinSearchTrees is

	function Empty return BinSearchTree is
	begin
		return null;
	end Empty;
	
	procedure Add(T: in out BinSearchTree; E: Item) is
	begin
		if Is_Empty(T) then
			T := new Node'(E, null, null);
		elsif E < T.value then
			Add(T.Left, E);
		elsif T.Value < E then
			Add(T.Right, E);
		end if;
	end Add;
	
	function Get_Root(T: BinSearchTree) return Item is
	begin
		if Is_Empty(T) then
			raise Tree_Empty;
		else 
			return T.Value;
		end if;
	end Get_Root;
	
	function Get_Left(T: BinSearchTree) return BinSearchTree is
	begin
		if Is_Empty(T) then
			raise Tree_Empty;
		else 
			return T.Left;
		end if;
	end Get_Left;
	
	function Get_Right(T: BinSearchTree) return BinSearchTree is
	begin
		if Is_Empty(T) then
			raise Tree_Empty;
		else 
			return T.Right;
		end if;
	end Get_Right;
	
	function Is_Empty(T: BinSearchTree) return Boolean is
	begin
		return T = null;
	end Is_Empty;

end BinSearchTrees;