with Ada.Text_IO, Ada.Calendar;
use Ada.Text_IO, Ada.Calendar;

procedure Elevator_Control is

    type Motor_Irany is (Elore, Megall, Hatra);
    type Motor_Command is (Backward, Forward, Power_Off);

    task Elevator is
        entry Move_Up;
        entry Move_Down;
    end Elevator;
    task body Elevator is
        Position: Integer := 0;
    begin
        loop
            select
                when Position < 40 =>
                    accept Move_Up do
                        Position := Position + 1;
                        Put_Line(Integer'Image(Position));
                    end Move_Up;
            or
                when Position > 0 =>
                accept Move_Down do
                    Position := Position - 1;
                    Put_Line(Integer'Image(Position));
                end Move_Down;
            or
                terminate;
            end select;
        end loop;
    end Elevator;
    
    task Motor is
        entry Command(M_C: Motor_Command);
    end Motor;
    task body Motor is
        Irany: Motor_Irany := Megall;
        Sebesseg: Integer := 0;
        Szint: Integer := 0;
        Ido_Elore: Duration := 0.0;
        Ido_Hatra: Duration := 0.0;
        Ido: Time := Clock;
        Ido_Tmp: Time;
        Turn_Off: Boolean := False;
    begin
        loop
            Ido_Tmp := Clock;
            select
                when not Turn_Off =>
                    accept Command(M_C: Motor_Command) do
                        if M_C = Backward then
                            if Irany = Megall or Irany = Hatra then
                                Ido_Hatra := Ido_Hatra + (Ido_Tmp - Ido);
                                Irany := Hatra;
                                Sebesseg := -1;
                            else
                                Irany := Megall;
                                Sebesseg := 0;
                            end if;
                        end if;
                        if M_C = Forward then
                            if Irany = Megall or Irany = Elore then
                                Ido_Elore := Ido_Elore + (Ido_Tmp - Ido);
                                Irany := Elore;
                                Sebesseg := 1;
                            else
                                Irany := Megall;
                                Sebesseg := 0;
                            end if;
                        end if;
                        if M_C = Power_Off then
                            Turn_Off := True;
                        end if;
                        Put_Line(Duration'Image(Ido_Elore - Ido_Hatra));
                    end Command;
            or
                when not Turn_Off =>
                    delay until Ido_Tmp + 0.1;
                    Szint := Szint + Sebesseg;
                    if Szint = 10 then
                        Szint := 0;
                        Elevator.Move_Up;
                    elsif Szint = -10 then
                        Szint := 0;
                        Elevator.Move_Down;
                    end if;
            end select;
        end loop;
    end Motor;

begin
    delay 1.0;
    Put_Line("Forward");
    Motor.Command(Forward);
    delay 1.5;
    Motor.Command(Forward);
    delay 0.5;
    Put_Line("Stop");
    Motor.Command(Backward);
    delay 0.7;
    Put_Line("Backward");
    Motor.Command(Backward);
    delay 0.5;
    Motor.Command(Backward);
    delay 1.0;
    Put_Line("Stop");
    Motor.Command(Forward);
    delay 1.0;
    Put_Line("Forward");
    Motor.Command(Forward);
    delay 2.0;
    Motor.Command(Power_Off);
end Elevator_Control;