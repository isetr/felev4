function Map ( T: T�mb ) return T�mb2 is
   Y: T�mb2(T'Range);
begin
    for I in T'Range loop
	   Y(I) := Op( T(I) );
    end loop;
    return Y;
end Map;
