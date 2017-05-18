with Ada.Text_IO;

package body Writer is

	protected body Write_Line is
		entry Put(To_Write: String) when not Is_Writing is
		begin
			Is_Writing := True;
			Ada.Text_IO.Put_Line(To_Write);
			Is_Writing := False;
		end Put;
	end Write_Line;
	
end Writer;