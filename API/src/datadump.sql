CREATE TABLE user_details (
    id int NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(20),
    email VARCHAR(30),
    location VARCHAR(50),
    phone_number INT, 
    password VARCHAR(20),
    PRIMARY KEY(`id`)
);
