create or replace function kat_atlag(n int) return number is
  cursor curs1 is select * from dolgozo join fizetes_kategoria 
    on fizetes >= also and fizetes <= felso
    where kategoria = n;
  rec curs1%rowtype;
  -- curs1%rowcount
  -- curs1%isopen
  -- curs1%notfound
  atl float;
  db int;
begin
  atl := 0.0;
  db := 0;
  for rec in curs1 loop
    atl := atl + rec.fizetes;
    db := db + 1;
  end loop;
  atl := atl / db;
  return atl;
end;

create or replace function kat_atlag2(n int) return number is
  cursor curs1 is select * from dolgozo join fizetes_kategoria 
    on fizetes >= also and fizetes <= felso
    where kategoria = n;
  rec curs1%rowtype;
  atl float;
  db int;
begin
  atl := 0.0;
  db := 0;
  open curs1;
    loop
      if curs1%notfound then 
        exit;
      end if;
      
      fetch curs1 into rec;
      atl := atl + rec.fizetes;
      db := db + 1;
    end loop;
  close curs1;
  atl := atl / db;
  return atl;
end;

create or replace procedure kiierparos(n int) is
  cursor curs1 is select * from dolgozo order by dnev;
  rec curs1%rowtype;
begin
  for rec in curs1 loop
    if curs1%rowcount mod 2 = 1 then
      dbms_putline(rec.dnev || ' ' || rec.fizetes);
    end if;
  end loop;
end;

--popup window
accept c_onev varchar(1) prompt  'add ...'; 

--to update
cursor curs1 is select * from dolgozo order by dnev for update of fizetes
update dolgozo set fizetes = fizetes + 1 where current of curs1;