CREATE TABLE IF NOT EXISTS `user` (
    `id` varchar(255) NOT NULL,
    `code` varchar(255) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `password` varchar(255) DEFAULT NULL,
    `role` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO scrum.`user`
(id, code, email, name, password, `role`)
SELECT 'a8b9d4dd-702f-477d-b986-c2be02dac959', 'ssf5', '123@qq.com', 'William', '43f0e138d78c676075951250d35675eea2121317', 'Scrum Master'
    WHERE NOT EXISTS (
    SELECT 1 FROM scrum.`user` WHERE id = 'a8b9d4dd-702f-477d-b986-c2be02dac959'
);