CREATE OR REPLACE FUNCTION faktor(n integer) RETURN integer IS
begin
  IF n = 0 THEN
      RETURN 1;
  ELSE
      RETURN n * faktor(n-1);
  END IF;
end;

create or replace FUNCTION hanyszor(p1 VARCHAR2, p2 VARCHAR2) RETURN integer IS
  i number;
  c number := 0;
begin
  for i in 1..length(p1) - length(p2) loop
    if substr(p1, 1, length(p2)) = p2 then
      c := c + 1;
    end if;
  end loop;
  return c;
end;

create or replace FUNCTION osszeg(p_char VARCHAR2) RETURN number IS
  tmp varchar(10) := '';
  i number;
  res number := 0;
begin
  for i in 1..length(p_char) loop
    if substr(p_char, i, 1) != '+' then
      tmp := tmp || substr(p_char, i, 1);
    else
      res := res + to_number(tmp);
      tmp := '';
    end if;
  end loop;
  res := res + to_number(tmp);
  return res;
end;