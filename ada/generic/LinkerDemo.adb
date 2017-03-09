with Linker, Ada.Text_IO;
use Ada.Text_IO;

procedure LinkerDemo is

    type Index is new Integer;
    type Elem is new Integer;
   type T�mb is array (Index range <>) of Elem;

   function F (E: Elem) return Boolean is
   begin
      return E < 0;
   end F;

   function KeresNegativ is new Linker(Elem, Index, T�mb, F);

   X: T�mb := (3,2,-5,7,1);
begin
   Put_Line(Index'Image(KeresNegativ(X)));

end LinkerDemo;
