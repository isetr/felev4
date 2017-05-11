with Ada.Text_IO, Ada.Numerics.Discrete_Random;
use Ada.Text_IO;

procedure Utkereszt is

	type Lampa_Szinek is (Piros, Sarga, Piros_Sarga, Zold);
	type String_Access is access String;
	type Duration_Access is access Duration;
	type Iranyok is (Egyenesen_Megy, Fordul);

	protected Lampa is
		procedure Valt;
		function Szin return Lampa_Szinek;
		
		entry Athalad;
	private
		Akt_Szin: Lampa_Szinek := Piros;
	end Lampa;
	
	protected body Lampa is
		procedure Valt is
		begin
			if Akt_Szin = Zold then
				Akt_Szin := Piros;
			else 
				Akt_Szin := Lampa_Szinek'Succ(Akt_Szin);
			end if;
			
			Put_Line(Lampa_Szinek'Image(Akt_Szin));
		end Valt;
		
		function Szin return Lampa_Szinek is
		begin
			return Akt_Szin;
		end Szin;
		
		entry Athalad when Akt_Szin = Zold is
		begin
			Put_Line("Lampa: egy auto athaladt.");
		end Athalad;
	end Lampa;

	task Utemezo is
		entry Leall;
	end Utemezo;
	task body Utemezo is
		Mukodik: Boolean := True;	
	begin
		while Mukodik loop
			Lampa.Valt;
			delay 3.0;
			Lampa.Valt;
			delay 0.5;
			Lampa.Valt;
			delay 2.0;
			Lampa.Valt;
			delay 1.0;
			select
				accept Leall do
					Mukodik := False;
					Put_Line("A szimulacio vegetert.");
				end Leall;
			else 
				Put_Line("A szimulacio fut tovabb.");
			end select;
		end loop;
	end Utemezo;
	
	package Iranyok_Random is new Ada.Numerics.Discrete_Random(Iranyok);
	
	protected Veletlen is
		procedure Reset;
		entry General(Irany: out Iranyok);
	private
		G: Iranyok_Random.Generator;
		Inicializalt: Boolean := False;
	end Veletlen;	
	
	protected body Veletlen is
		procedure Reset is
		begin
			Iranyok_Random.Reset(G);
			Inicializalt := True;
		end Reset;
		
		entry General(Irany: out Iranyok) when Inicializalt is
		begin
			Irany := Iranyok_Random.Random(G);
		end General;
	end Veletlen;
	
	task type Auto(Rendszam: String_Access; Menetido_A_Lampaig: Duration_Access);
	task body Auto is
		Atment: Boolean := False;
		Irany: Iranyok;
	begin
		Put_Line(Rendszam.all & ": elindult.");
		delay Menetido_A_Lampaig.all;
		Put_Line(Rendszam.all & ": odaert a lampahoz");
		while not Atment loop
			select
				Lampa.Athalad;
				Atment := True;
				Veletlen.General(Irany);
				Put_Line(Rendszam.all & ": atment a lampanal, irany: " & Iranyok'Image(Irany));
			or
				delay 0.2;
				Put_Line(Rendszam.all & ": varakozik a lampanal.");
			end select;
		end loop;
	end Auto;
	
	task Lampaszerelo;
	task body Lampaszerelo is
	begin
		delay 15.0;
		Utemezo.Leall;
	end Lampaszerelo;
	
	type Auto_Access is access Auto;
	Autok: array (1..3) of Auto_Access;
begin
	Veletlen.Reset;
	Autok(1) := new Auto(new String'("A"), new Duration'(1.5));
	Autok(2) := new Auto(new String'("B"), new Duration'(3.3));
	Autok(3) := new Auto(new String'("C"), new Duration'(7.5));
	--Autok(4) := new Auto(new String'("D"), new Duration'(5.0));
	--Autok(5) := new Auto(new String'("E"), new Duration'(0.2));
	--Autok(6) := new Auto(new String'("F"), new Duration'(12.0));
	--Autok(7) := new Auto(new String'("G"), new Duration'(4.2));
end Utkereszt;