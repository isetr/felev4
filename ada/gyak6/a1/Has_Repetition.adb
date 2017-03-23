function Has_Repetition (X: Vector) return Boolean is
	L: Boolean := False;
begin
	for I in X'First..Index'Pred(X'Last) loop
		L := L or X(I) = X(Index'Succ(I));
	end loop;
	
	return L;
end Has_Repetition;