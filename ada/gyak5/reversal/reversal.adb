procedure Reversal( T: in out Tomb ) is
	I: Index := T'First;
	J: Index := T'Last;
begin
	for K in 1 .. (T'Length / 2) loop
		Swap(T(I), T(J));
		I := Index'Succ(I);
		J := Index'Pred(J);
	end loop;
end Reversal;