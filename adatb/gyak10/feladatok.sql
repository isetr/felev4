--CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
--CREATE TABLE oszt2 AS SELECT * FROM nikovits.osztaly;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
delete from dolg2 
where jutalek is null;
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
delete from dolg2 
where belepes < to_date('1982.01.01', 'YYYY.MM.DD');
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
delete from dolg2 
where oazon = (select oazon from oszt2 where telephely = 'DALLAS');
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
delete from dolg2
where fizetes < (select avg(fizetes) from dolg2);
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
delete from dolg2 
where fizetes = (select max(fizetes) from dolg2);
select * from dolg2;
drop table dolg2;

CREATE TABLE oszt2 AS SELECT * FROM nikovits.osztaly;
delete from oszt2
where count((select * from dolg2, fiz_kategoria 
  where fiz_kategoria.kategoria = 2 
  and fizetes >= fiz_kategoria.also 
  and fizetes <= fiz_kategoria.felso
)) > 0;
select * from oszt2;
drop table oszt2;

CREATE TABLE oszt2 AS SELECT * FROM nikovits.osztaly;
delete from oszt2
where count((select * from dolg2, fiz_kategoria 
  where fiz_kategoria.kategoria = 2 
  and fizetes >= fiz_kategoria.also 
  and fizetes <= fiz_kategoria.felso
)) >= 2;
select * from oszt2;
drop table oszt2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
insert into dolg2 (dkod, dnev, oazon, belepes, fizetes) 
values (1, 'Kovacs', 10, current_date(), (
  select avg(fizetes) 
  from dolg2
  where oazon = 10
));
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set fizetes = fizetes * 1.2
where oazon = 20;
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set fizetes = fizetes + 500
where jutelek is null
or fizetes < (select avg(fizetes) from dolg2);
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set jutalek = nvl(jutalek, 0) + (select max(jutalek) from dolg2);
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set dnev = 'Loser'
where fizetes = (select min(fizetes) from dolg2);
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set jutalek = nvl(jutalek, 0) + 3000
where count(dkod = (select fonoke from dolg2)) >= 2;
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set fizetes = fizetes + (select min(fizetes) from dolg2)
where count(dkod = (select fonoke from dolg2)) > 0;
select * from dolg2;
drop table dolg2;

CREATE TABLE dolg2 AS SELECT * FROM nikovits.dolgozo;
update dolg2
set fizetes = fizetes + (select avg(fizetes) from dolg2)
where count(dkod = (select fonoke from dolg2)) = 0;
select * from dolg2;
drop table dolg2;

create view dof as
(select * from dolg2 
  natural join oszt2 
  inner join fiz_kategoria 
  on dolg2.fiz between fiz_kategoria.also and fiz_kategoria.felso);

