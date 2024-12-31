USE `SYS`;
DROP DATABASE `movies-database`;
CREATE DATABASE `movies-database` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `movies-database`;

DROP TABLE `movie`;
CREATE TABLE `movie` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `title` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `director` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `poster` text,
  `rate` decimal(2,1) NOT NULL,
  `estado` boolean default (true),
   CONSTRAINT `movie_title_unique` UNIQUE(title),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE `user`;
CREATE TABLE if NOT EXISTS`user` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `name` varchar(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` boolean default(true),
  `created_at` timestamp default(now()),
  `updated_at` timestamp default(now()),
  CONSTRAINT `user_username_unique` UNIQUE(username),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


###### INSERT MOVIES #############
INSERT INTO movie(id, tigle, year, director, duration, poster, rate) VALUE(UUID_TO_BIN(UUID()), 'alfredo montoya calderon', 'amontoya', '123456');

###### INSERT USERS #############
INSERT INTO user(id, name, username, password) VALUE(UUID_TO_BIN(UUID()), 'alfredo montoya calderon', 'amontoya', '123456');




