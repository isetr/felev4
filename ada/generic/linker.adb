function Linker ( T: T�mb ) return Index is
   L: Boolean := False;
begin
   for I in T'Range loop
      if Op(T(I)) then
         return I;
      end if;
   end loop;
   return T'Last;
end Linker;
