generic
	type Item is private;
	with function "<"(L, R: Item) return Boolean is <>;

package BinSearchTrees is

	type BinSearchTree is limited private;
	
	function Empty return BinSearchTree;
	procedure Add(T: in out BinSearchTree; E: Item);
	
	Tree_Empty: Exception;
	
	function Get_Root(T: BinSearchTree) return Item;
	
	function Get_Left(T: BinSearchTree) return BinSearchTree;
	
	function Get_Right(T: BinSearchTree) return BinSearchTree;
	
	function Is_Empty(T: BinSearchTree) return Boolean;
	
private
	type Node;
	type BinSearchTree is access Node;
	type Node is record
		Value: Item;
		Left, Right: BinSearchTree;
	end record;

end BinSearchTrees;