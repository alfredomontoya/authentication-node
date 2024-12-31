select * from users;
select BIN_TO_UUID(id), name, username, estado from users;

INSERT INTO users(id, name, username, password) VALUE(UUID_TO_BIN(UUID()), 'alfredo montoya calderon', 'amontoya', '123456');

select BIN_TO_UUID(ID) as _id from movie;

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