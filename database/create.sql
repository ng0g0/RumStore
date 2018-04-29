--alter table rbm_user add column userobjects int8[];

--select x.*  from rbm_user x

--alter table rbm_user  add column usrrole int2 not null default 0

--drop table rbm_usr_items
--create table rbm_usr_items (
--	usrid int4,
--	asib varchar(32),
--	itemid varchar(32)
--) 

--alter table rbm_usr_items alter column itemid varchar(32)

DROP TABLE rbm_user;
create table rbm_user (
	usrid serial8,
	username varchar(32) NOT NULL,
	password varchar(128) NOT NULL,
	firstname varchar(128) NOT NULL,
	lastname varchar(128) NOT NULL,
	userToken varchar(128),
	userExpires Date,
	active int4,
    userobjects int8[],
    usrrole int2 not null default 0,
	CONSTRAINT rbm_username_key UNIQUE (username) 
);


CREATE TYPE objdetils AS (
    detname     text,
    dettype     integer
);

CREATE TYPE objtypes AS (
    typename     text,
    typeshort     bpchar(1),
    typemastershort bpchar(1)
);

DROP TABLE 	 rbm_objects;
CREATE TABLE rbm_objects (
	objid serial8,
	objmaster int4 NOT NULL,
	objactive int4 NOT NULL,
    objdetail objdetils[],
    objtype objtypes
);

--alter table rbm_objects add column objtypenew objtypes
--alter table rbm_objects add column objdetail objdetils[]

--DROP TABLE 	 rbm_object_type;
--CREATE TABLE rbm_object_type (
--	objtypeid int4 NOT NULL,
--	typename varchar(32) NOT NULL,
--	objactive int4 NOT NULL,
--	objtypemaster int4 NULL,
--	objshort bpchar(1) NOT NULL,
--	CONSTRAINT rbm_object_type_objshort_key UNIQUE (objshort)
--);

--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (1,'BLOCK',1,0,'b');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (2,'ENTRANCE',1,1,'e');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (3,'FLOOR',1,2,'f');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (4,'APARTMENT',1,3,'a');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (5,'PERSON',1,4,'p');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (6,'ACOM-BL',1,1,'t');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (7,'ACOM-ENT',1,2,'v');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (8,'ACOM-FL',1,3,'i');
--INSERT INTO rbm_object_type (objtypeid,typename,objactive,objtypemaster,objshort) VALUES (9,'ACOM-AP',1,4,'w');



--DROP TABLE 	 rbm_obj_type_det;
--CREATE TABLE rbm_obj_type_det (
--	objtypedetid int4 NOT NULL,
--	objtypedetname varchar(16) NOT NULL,
--	objtypedettype int2 NOT NULL,
--	visible varchar(32) NOT NULL
--);

--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (1,'MAX',1,'n');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (2,'SIZE',1,'a');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (3,'ADDRESS',2,'b');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (4,'NUMBER',2,'be');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (5,'BDAY',3,'p');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (6,'AGE',1,'p');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (7,'PET',4,'p');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (8,'NAME',2,'ptivw');
--INSERT INTO rbm_obj_type_det (objtypedetid,objtypedetname,objtypedettype,visible) VALUES (9,'RECURENCTY',5,'tivw');

--types -- 1 integer, 2 - name - 3 - date , 4 - bool , 5 - Rlist (Onetime, Daily, Weekly, Montly, Quater, HYear, Yearly )



--drop table rbm_obj_account;
--create table rbm_obj_account (
--/	objid int4 NOT NULL,
--	acctype int2 not null, --1 income , 2-- outcome
--	description varchar(32) not null, 
--	value number not null 
--)

--select string_agg(rotX.typename, ',')||',INFOBLOCK,DELETE' actionX from rbm_object_type rotX
--select string_agg(z.itemid, ',') from rbm_usr_items z where z.usrid = 3

 -- SELLECT DETAILS 
 select  '{'|| string_agg( 
 case when (det.dettype = rotd.objtypedetid) then '"'||rotd.objtypedetname||'":"'||det.detname||'"' 
 else '" "'  end, ',') ||'}' as details ,objid
 from (select t.*, objid from rbm_objects  det, UNNEST(objdetail) as t(detname,dettype)  
 ) det, rbm_obj_type_det rotd  
 where det.dettype = rotd.objtypedetid 
 group by objid
 
 -- select DET 
 
 objmaster int4 NOT NULL,
	objactive int4 NOT NULL,
    objdetail objdetils[],
    objtype objtypes
 
    insert into rbm_objects(objtype,objmaster, objactive) values(
    (select objtypeid from rbm_object_type where typename = 'FLOOR'),95,1)
    
 insert into rbm_objects(objtype,objmaster, objactive) values((select objtypeid from rbm_object_type where typename = 'ENTRANCE'),$1,1) RETURNING objid";   
 
select (select objtypeid from rbm_object_type where typename = 'FLOOR') as objtype,95 as objmaster, 1 as objactive 
from ( select '2' as detname, 4 as dettype EXCEPT
select detname,dettype from (select t.* from rbm_objects  det, UNNEST(objdetail) as t(detname,dettype) 
where objmaster = 95 ) x 
 ) y

 select --* 
  COALESCE(indata.detname,dbdata.detname ) as detname, 
  COALESCE(indata.dettype, dbdata.dettype ) as dettype,
  dbdata.objid, 
  case when dbdata.objid is null then 'ADD'
  	   when indata.detname is null then 'DEL'
  else 'EXIST' end as actionX	   
 from (
 	select t.*,4 as dettype, null as  objid from UNNEST(ARRAY['1','0']) as t(detname)
) indata FULL OUTER JOIN (
 select t.*, det.objid from rbm_objects  det, UNNEST(objdetail) as t(detname,dettype) 
where objmaster = 95 and objactive = 1) dbdata on indata.detname = dbdata.detname 
 
 
 update rbm_objects set objdetail = array_append(objdetail, CAST(ROW(1,4) as objdetils)) where objid =  98
insert into rbm_objects(objtype,objmaster, objactive,objdetail) 
values((select objtypeid from rbm_object_type where typename = 'FLOOR'),95,1,ARRAY[CAST(ROW('1',4) as objdetils)])
insert into rbm_objects(objtype,objmaster, objactive) values($2,$1,1, ARRAY[]) RETURNING objid
 
 delete from rbm_objects where objmaster = 95 and objid !=96
 select * from rbm_objects x where x.objmaster = 95 order by 1
 select * from rbm_objects x 
 -- ADD BLOCK DET
 update rbm_objects set objdetail = array_append(objdetail, CAST(ROW('TEST',8) as objdetils)) where objid = 14
  -- UPDATE BLOCK DET 
 update rbm_objects set objdetail = array_append(case when 2 =1 then  null else objdetail end, CAST(ROW('test',3) as objdetils)) where objid = 90