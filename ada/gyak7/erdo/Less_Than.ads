generic
	type Index is (<>);
	type Grid is array (Index range <>, Index range <>) of Natural;

function Less_Than(G: Grid; Max: Natural) return Boolean;