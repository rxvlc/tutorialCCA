select 1 from dual;
INSERT INTO category(name) VALUES ('Eurogames');
INSERT INTO category(name) VALUES ('Ameritrash');
INSERT INTO category(name) VALUES ('Familiar');

INSERT INTO author(name, nationality) VALUES ('Alan R. Moon', 'US');
INSERT INTO author(name, nationality) VALUES ('Vital Lacerda', 'PT');
INSERT INTO author(name, nationality) VALUES ('Simone Luciani', 'IT');
INSERT INTO author(name, nationality) VALUES ('Perepau Llistosella', 'ES');
INSERT INTO author(name, nationality) VALUES ('Michael Kiesling', 'DE');
INSERT INTO author(name, nationality) VALUES ('Phil Walker-Harding', 'US');

INSERT INTO game(title, age, category_id, author_id) VALUES ('On Mars', '14', 1, 2);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Aventureros al tren', '8', 3, 1);
INSERT INTO game(title, age, category_id, author_id) VALUES ('1920: Wall Street', '12', 1, 4);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Barrage', '14', 1, 3);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Los viajes de Marco Polo', '12', 1, 3);
INSERT INTO game(title, age, category_id, author_id) VALUES ('Azul', '8', 3, 5);

INSERT INTO client(name) VALUES ('pepe1');
INSERT INTO client(name) VALUES ('pepe2');
INSERT INTO client(name) VALUES ('pepe3');
INSERT INTO client(name) VALUES ('pepe4');

INSERT INTO LOAN(BEGIN_DATE,END_DATE,CLIENT_ID,GAME_ID) VALUES ('2001-01-01','2001-03-02',2,2);
INSERT INTO LOAN(BEGIN_DATE,END_DATE,CLIENT_ID,GAME_ID) VALUES ('2001-01-01','2001-03-02',2,3);
INSERT INTO LOAN(BEGIN_DATE,END_DATE,CLIENT_ID,GAME_ID) VALUES ('2001-01-01','2001-03-02',3,4);
INSERT INTO LOAN(BEGIN_DATE,END_DATE,CLIENT_ID,GAME_ID) VALUES ('2001-01-01','2001-03-02',3,5);
INSERT INTO LOAN(BEGIN_DATE,END_DATE,CLIENT_ID,GAME_ID) VALUES ('2001-01-01','2001-03-02',4,6);
