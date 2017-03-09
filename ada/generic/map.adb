function Map ( T: Tömb ) return Tömb2 is
   Y: Tömb2(T'Range);
begin
    for I in T'Range loop
	   Y(I) := Op( T(I) );
    end loop;
    return Y;
end Map;
