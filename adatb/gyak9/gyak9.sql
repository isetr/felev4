-- CREATE
create table users (
  u_id       int not null,
  username   varchar(30),
  full_name  varchar(100),
  passwd     varchar(100),
  primary key(u_id)
);

-- INSERT
insert into users (passwd, u_id, username) values ('asd', 1, 'Lul');
insert into users values (2, 'AFDLKM', 'ASD ASD', 'asda');

-- UPDATE
update users set passwd='dsa' where u_id=1;

-- DELETE
delete from users where u_id='2';

-- DROP
drop table users;

-- ALTER
alter table users add Last_login date;

-----------------
create table orders(
  o_id    int not null,
  u_id    int not null,
  p_name  varchar(100),
  price   int,
  primary key(o_id),
  foreign key(u_id) references users(u_id)
);

insert into orders values (1, 1, 'alma', 2);
insert into orders values (2, 1, 'korte', 3);

------------------
create or replace procedure hello is
  msg varchar(100) := 'hi';
begin
  dbms_output.put_line(msg);
end;
-----------------
if ... then
  ...
elsif ... then
  ...
else
  ...
end if;
-----------------
of i in {reverse} 1..n loop
  ...
end loop;
------------------
create or replace procedure szamol (a int, b int) is
  i int;
begin
  for i in a..b loop
    if mod(1,2) = 0 then
      dbms_output.put_line(i);
    end if;
  end loop;
end;
-----------------
create or replace function prim(n int) return int is
  i int;
begin
  for i in 2..n/2 loop
    if  mod(n, i) = 0 then
      return 1;
    end if;
  end loop;
  return 0;
end;

select prim(3) from dual;
-----------------
create or replace function lnko(a int, b int) return int is
  i int;
begin
  for i in reverse 1..a loop
    if mod(a, i) = 0 and mod(b, i) = 0 then
      return i;
    end if;
    return 1;
  end loop;
end;
