with Ada.Text_IO, Ada.Calendar;
use Ada.Text_IO, Ada.Calendar;

procedure Elevator_Control is

    type Motor_Irany is (Elore, Megall, Hatra);
    type Motor_Command is (Backward, Forward);

    task Motor is
        entry Command(M_C: Motor_Command);
    end Motor;
    task body Motor is
        Irany: Motor_Irany := Megall;
        Sebesseg: Integer := 0;
        Ido_Elore: Duration := 0.0;
        Ido_Hatra: Duration := 0.0;
        Ido: Time := Clock;
        Ido_Tmp: Time;
    begin
        loop
            Ido_Tmp := Clock;
            select
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
                    Put_Line(Duration'Image(Ido_Elore - Ido_Hatra));
                end Command;
            or terminate;
            end select;
        end loop;
    end Motor;
    
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

begin
    Elevator.Move_Up;
    Elevator.Move_Down;
    Elevator.Move_Up;
    Elevator.Move_Up;
    
end Elevator_Control;