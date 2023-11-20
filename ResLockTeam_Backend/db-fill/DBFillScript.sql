insert into organization (org_id, name)
values (1, "MSOE");

insert into building (building_id, org_id, name, addr, building_code)
values (1, 1, "Margaret Loock Hall", "324 E Juneau Ave", "MLH");

insert into building (building_id, org_id, name, addr, building_code)
values (2, 1, "Viets Res Hall", "1121 Milwaukee Ave", "VT");

insert into building (building_id, org_id, name, addr, building_code)
values (3, 1, "Grohmann Tower", "322 E Juneau Ave", "GT");

-- all passwords are "secret"
insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("johnapple@yahoo.com", "John", "Appleseed", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 100, 1, 1, 1, 1, 1);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("bobby@yahoo.com", "Bob", "Smith", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 100, 0, 1, 3, 1, 1);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("betty@gmail.com", "Betty", "White", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 210, 1, 1, 2, 1, 1);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("spears@hotmail.com", "Britney", "Spears", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 500, 1, 1, 1, 0, 0);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (1, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 10 HOUR), 0, "johnapple@yahoo.com", 1);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (2, DATE_ADD(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 10 DAY), 1, "johnapple@yahoo.com", 2);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (3, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 1 WEEK), 0, "johnapple@yahoo.com", 3);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (4, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 WEEK), 0, "bobby@yahoo.com", 1);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (5, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 2 WEEK), 1, "bobby@yahoo.com", 3);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (6, DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 1 MONTH), 0, "betty@gmail.com", 3);


 -- UWM -------------------------------------------------------------------------------- 
insert into organization (org_id, name)
values (2, "UWM");

insert into building (building_id, org_id, name, addr, building_code)
values (4, 2, "Cambridge Commons", "2323 North Cambridge Avenue", "CC");

insert into building (building_id, org_id, name, addr, building_code)
values (5, 2, "Sandburg Halls", "3400 N. Maryland Avenue", "SH");

insert into building (building_id, org_id, name, addr, building_code)
values (6, 2, "RiverView Residence Hall", "2340 North Commerce Street", "RV");

-- all passwords are secret
insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("alice@yahoo.com", "Alice", "John", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 444, 1, 2, 6, 1, 1);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("will@yahoo.com", "Will", "Smith", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 203, 0, 2, 5, 1, 1);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (7, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 8 HOUR), 0, "alice@yahoo.com", 5);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (8, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 10 WEEK), 1, "alice@yahoo.com", 6);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (9, DATE_ADD(NOW(), INTERVAL 2 MINUTE), DATE_ADD(NOW(), INTERVAL 2 WEEK), 0, "will@yahoo.com", 5);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (10, DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 1 WEEK), 0, "will@yahoo.com", 5);


 -- MARQUETTE ----------------------------------------------------------------------------- 

insert into organization (org_id, name)
values (3, "Marquette");

insert into building (building_id, org_id, name, addr, building_code)
values (7, 3, "Abbottsford Hall", "722 N. 13th St", "AB");

insert into building (building_id, org_id, name, addr, building_code)
values (8, 3, "Carpenter Tower", "1032 W. Wisconsin", "CT");

insert into building (building_id, org_id, name, addr, building_code)
values (9, 3, "Cobeen Hall", "1111 W. Wells St.", "CH");

insert into building (building_id, org_id, name, addr, building_code)
values (10, 3, "Humphrey Hall", "1716 W. Wisconsin Ave", "HH");

-- all passwords are secret
insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("heisenberg@hotmail.com", "Walter", "White", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 453, 1, 3, 10, 1, 0);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("tom@yahoo.com", "Tom", "Smith", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 783, 0, 3, 9, 1, 1);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("skysky@gmail.com", "Skylar", "White", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 432, 1, 3, 8, 1, 1);

insert into user (email, first_name, last_name, password, room, privilege, org_id, building_id, verified, registered)
values ("sophia@yahoo.com", "Sophia", "Smith", "$2b$10$FDoWaAqVeCoy8SsUZHOhG.pEQCrigztx5pB2oEChwlp3wDJrcYxiO", 123, 1, 3, 7, 1, 1);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (11, DATE_ADD(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 10 DAY), 0, "heisenberg@hotmail.com", 10);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (12, DATE_ADD(NOW(), INTERVAL 1 WEEK), DATE_ADD(NOW(), INTERVAL 10 MONTH), 1, "heisenberg@hotmail.com", 10);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (13, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 WEEK), 0, "tom@yahoo.com", 9);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (14, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY), 0, "skysky@gmail.com", 8);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (15, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 2 DAY), 1, "sophia@yahoo.com", 7);

insert into mail (mail_id, date_received, date_picked_up, is_letter, email, building_id)
values (16, DATE_ADD(NOW(), INTERVAL 4 MINUTE), DATE_ADD(NOW(), INTERVAL 1 DAY), 0, "sophia@yahoo.com", 7);