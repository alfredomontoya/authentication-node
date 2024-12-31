CREATE TABLE `movie` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `title` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `director` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `poster` text,
  `rate` decimal(2,1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE `users`;
CREATE TABLE if NOT EXISTS`users` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `name` varchar(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` int default(1),
  `created_at` timestamp default(now()),
  `updated_at` timestamp default(now()),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

select * from users;
select BIN_TO_UUID(id), name, username, estado from users;

INSERT INTO users(id, name, username, password) VALUE(UUID_TO_BIN(UUID()), 'alfredo montoya calderon', 'amontoya', '123456');

select BIN_TO_UUID(ID) as _id from movie;

SELECT * FROM movie;CREATE TABLE `movie` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `title` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `director` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `poster` text,
  `rate` decimal(2,1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

select * from movie;
select * from genre;
select * from movie_genres;

select BIN_TO_UUID(m.id) as uuid, m.* from movie AS m;

select * from movie where BIN_TO_UUID(id) = '834e5c44-bef9-11ef-8612-0a002700000b';
										

select BIN_TO_UUID(mg.movie_id) as movie_id,  mg.genre_id from movie_genres AS mg;

SELECT
	BIN_TO_UUID(m.id) as _id,
	m.*,
    mg.genre_id,
    g.name
FROM
	movie as m
    INNER JOIN movie_genres as mg on (m.id=mg.movie_id)
    INNER JOIN genre as g on (mg.genre_id=g.id);


SELECT 
    m.id, 
    m.title, 
    m.director, 
    m.duration, 
    m.poster, 
    m.rate, 
    GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
FROM 
    movie m
LEFT JOIN 
    movie_genres mg ON m.id = mg.movie_id
LEFT JOIN 
    genre g ON mg.genre_id = g.id
WHERE g.name like '%Drama%'
GROUP BY 
    m.id, m.title, m.director, m.duration, m.poster, m.rate;
    

SELECT BIN_TO_UUID(mg.movie_id) FROM movie_genres as mg WHERE mg.genre_id=1;

select UUID();

INSERT INTO movie(
        id,
        title,
        year,
        rate,
        duration,
        poster
      ) VALUES (
        ?, ?, ?, ?, ?, ?
      );
      
      
      
      
      CREATE TABLE `movie` (
  `id` binary(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
  `title` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `director` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `poster` text,
  `rate` decimal(2,1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
