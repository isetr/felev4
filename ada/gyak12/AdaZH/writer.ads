package Writer is

	protected Write_Line is
		entry Put(To_Write: String);
	
	private
		Is_Writing: Boolean := False;
	end Write_Line;
	
end Writer;