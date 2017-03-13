SELECT 
count(*), 
count(fizetes), 
count(distinct fizetes), 
sum(fizetes), 
sum(distinct fizetes), 
avg(fizetes), 
avg(distinct fizetes)
FROM dolgozo 
WHERE dnev like '%O%' 
GROUP BY dnev 
HAVING sum(fizetes) > 2000;

--create table fiz_kategoria as select * from nikovits.fiz_kategoria;

select fiz_kategoria.kategoria, count(*) dszam
from dolgozo, fiz_kategoria 
where dolgozo.fizetes between fiz_kategoria.also and fiz_kategoria.felso
group by fiz_kategoria.kategoria
having count(*) >= 3;

select fiz_kategoria.kategoria, count(distinct oazon) oazonok
from dolgozo, fiz_kategoria 
where dolgozo.fizetes between fiz_kategoria.also and fiz_kategoria.felso
group by fiz_kategoria.kategoria
having count(distinct oazon) = 1;

select fiz_kategoria.kategoria, count(*) dszam
from dolgozo, fiz_kategoria 
where dolgozo.fizetes between fiz_kategoria.also and fiz_kategoria.felso
and fiz_kategoria.kategoria = 1
group by fiz_kategoria.kategoria;

select oazon, telephely from
(select osztaly.oazon, dolgozo.oazon, fiz_kategoria.kategoria
from fiz_kategoria, dolgozo, osztaly
where kategoria = 1
and dolgozo.oazon = osztaly.oazon
and dolgozo.fizetes between fiz_kategoria.also and fiz_kategoria.felso)
group by oazon, telephely;

select oazon, telephely from
(select osztaly.oazon, dolgozo.oazon, fiz_kategoria.kategoria
from fiz_kategoria, dolgozo, osztaly
where kategoria = 1
and dolgozo.oazon = osztaly.oazon
and dolgozo.fizetes between fiz_kategoria.also and fiz_kategoria.felso)
group by oazon, telephely
having count(*) >= 2;

select 
decode(mod(dkod, 2), 0, 'páros', 'páratlan') as paritás, 
count(*) as létszám
from dolgozo
group by mod(dkod, 2);

select foglalkozas, 
count(*) as darab, 
round(avg(fizetes)) as atlagfiz,
RPAD(' ', round(avg(fizetes)) / 200 + 1, '#') as grafika
from dolgozo
group by foglalkozas
order by (round(avg(fizetes)));

select count(distinct gyumolcs) as gyümölcsök
from szeret;

select nev, count(*)
from szeret
group by nev
having count(*) = 
  (select 
  count(distinct gyumolcs)
  from szeret);
  
--(select nev from szeret) * (select gyumolcs from szeret where nev = 'Micimackó');
select distinct nev 
from
  (select nev from szeret),
  (select gyumolcs 
  from szeret
  where nev = 'Micimackó')
  minus
  (select * from szeret);

select distinct nev 
from
  (select * from szeret)
  minus
  ((select nev from szeret),
  (select gyumolcs 
  from szeret
  where nev = 'Micimackó'));

