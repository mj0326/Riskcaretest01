use covid;

CREATE TABLE covid_stat(
     base_date           VARCHAR(100)
    ,location            VARCHAR(20)
    ,total_confirmed_cnt INTEGER
    ,daily_confirmed_cnt INTEGER
    ,local_cnt           INTEGER
    ,inflow_cnt          INTEGER
    ,isolation_cnt       INTEGER
    ,release_cnt         INTEGER
    ,dead_cnt            INTEGER
    ,ratio_100k          DOUBLE
);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','검역',1740,3,0,4,278,1463,0,0);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','제주',58,0,0,0,0,59,0,8.8);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','경남',314,1,0,1,16,299,0,9.37);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','경북',1586,0,0,0,17,1513,57,59.61);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','전남',184,1,1,0,9,174,2,9.92);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','전북',166,4,1,1,22,144,0,9.13);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','충남',538,3,3,0,40,488,8,25.25);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','충북',187,1,0,2,13,174,2,11.82);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','강원',278,6,6,0,48,228,3,18.11);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','경기',5378,33,23,9,630,4657,89,40.57);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','세종',85,3,0,0,1,78,0,23.08);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','울산',183,2,0,2,8,153,2,14.21);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','대전',412,0,0,0,31,405,6,29.98);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','광주',541,0,0,0,8,500,3,35.08);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','인천',1043,3,2,1,53,979,10,35.25);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','대구',7162,10,10,0,26,6943,196,294.07);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','부산',599,0,0,0,88,495,7,17.29);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','서울',5968,48,47,1,407,5475,78,61.23);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.29','합계',26385,113,93,21,1695,24227,463,50.89);

INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','검역',1741,4,0,4,278,1463,0,0);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','제주',59,0,0,0,0,59,0,8.8);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','경남',315,1,0,1,16,299,0,9.37);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','경북',1587,0,0,0,17,1513,57,59.61);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','전남',185,1,1,0,9,174,2,9.92);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','전북',166,2,1,1,22,144,0,9.13);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','충남',536,3,3,0,40,488,8,25.25);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','충북',189,2,0,2,13,174,2,11.82);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','강원',279,6,6,0,48,228,3,18.11);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','경기',5376,32,23,9,630,4657,89,40.57);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','세종',79,0,0,0,1,78,0,23.08);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','울산',163,2,0,2,8,153,2,14.21);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','대전',442,0,0,0,31,405,6,29.98);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','광주',511,0,0,0,8,500,3,35.08);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','인천',1042,3,2,1,53,979,10,35.25);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','대구',7165,10,10,0,26,6943,196,294.07);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','부산',590,0,0,0,88,495,7,17.29);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','서울',5960,48,47,1,407,5475,78,61.23);
INSERT INTO covid_stat(base_date,location,total_confirmed_cnt,daily_confirmed_cnt,local_cnt,inflow_cnt,isolation_cnt,release_cnt,dead_cnt,ratio_100k) VALUES ('2020.10.30','합계',26385,114,93,21,1695,24227,463,50.89);
