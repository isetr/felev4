generic 
	type Index is (<>);
	type Item is private;
	type Vector is array (Index range <>) of Item;
	
function Most_Frequent (X: Vector) return Item;