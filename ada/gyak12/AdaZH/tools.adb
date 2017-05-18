with Ada.Text_IO, Ada.Numerics.Discrete_Random;
use Ada.Text_IO;

package body tools is

   -- ezt nekik kell megírni
   protected body Output is
      procedure Puts(str: String; num:Natural:=0) is
      begin
         Put(str);
         if num>0 then
           New_Line;  -- most csak 0 vagy 1 új sor
        end if;
      end;
   end Output;
   
   -- innentõl nem -------------------------------------------------
   package body Random_Generator is
      package Gen_Pack is new Ada.Numerics.Discrete_Random(T);
      
         protected Generator is
            function GetRand return T;
            procedure Init;      
         
            private
               g: Gen_Pack.Generator;
         end Generator;

         protected body Generator is
            function GetRand return T is
            begin
               return Gen_Pack.Random(g);         
            end GetRand;
         
            procedure Init is
            begin
               Gen_Pack.Reset(g);
            end Init;     
         end Generator;

      function GetRandom return T is
      begin
         return Generator.GetRand;   
      end GetRandom;
      
   begin
      Generator.Init; 
   end Random_Generator;
end tools;