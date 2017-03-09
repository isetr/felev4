with Map, Ada.Text_IO;
use Ada.Text_IO;

procedure MapDemo is

    type Index is new Integer;
    type Elem is new Integer;
    type Elem2 is new Float;
   type T�mb is array (Index range <>) of Elem;
   type T�mb2 is array (Index range <>) of Elem2;

   function F (E: Elem) return Elem2 is
   begin
      return Elem2(E) / 2.0;
   end F;

   function D (E: Elem) return Elem is
   begin
      return E * 2;
   end D;

   function Felez is new Map(Elem, Elem2, Index, T�mb, T�mb2, F);
   function Double is new Map(Elem, Elem, Index, T�mb, T�mb, D);

   X: T�mb := (3,2,5,7,1);
   T: T�mb2(X'Range);
   Z: T�mb(X'Range);
begin
   T := Felez(X);
   for i in T'Range loop
      Put_Line(Elem2'Image(T(I)));
   end loop;

   Z := Double(X);
   for i in T'Range loop
      Put_Line(Elem'Image(Z(I)));
   end loop;

end MapDemo;
