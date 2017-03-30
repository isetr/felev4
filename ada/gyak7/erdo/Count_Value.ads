generic
	type Index is (<>);
	type Element is limited private;
	type Grid is array (Index range <>, Index range <>) of Element;
	with function Predicate(E: Element) return Boolean;
	
function Count_Value(G: Grid) return Natural;