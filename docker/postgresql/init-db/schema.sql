--- Table: users
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    role VARCHAR(20) NOT NULL
);

INSERT INTO users
    (user_id, username, password, role)
VALUES
    ('b293d9a9-1d1a-4729-a333-ea4435620b48', 'admin', '$2b$10$B2rRkYBz0snA4/y2XwV7DuYxhbftvlBdz.bgSj0l24hKleMQhnO9q', 'admin'),
    ('df960bb2-2647-4b0f-937f-ac3d26780913', 'alex', '$2b$10$zDY5xAcHzUqHQJD4zF2ozeC3G23N46X6BLpU/lm7C4Xwal12ZtsZW', 'regular'),
    ('6ec2a8d2-c75f-48d8-9a4f-2d484a4d6386', 'carlos', '$2b$10$kb7YQ4tlfuUmP3nJa1cuRe1qk2oEx74K/FilnHmXjVMY3leffH61u', 'regular');

--- Table: items
CREATE TABLE items (
    item_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (user_id),
    title VARCHAR(100) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) NOT NULL,
    due_date TIMESTAMP NULL
);

CREATE INDEX items_status_idx ON items (status);
CREATE INDEX items_user_id_idx ON items (user_id);
CREATE INDEX items_user_id_status_idx ON items (user_id,status);

INSERT INTO items
    (item_id, user_id, title, description, status, due_date) 
VALUES
    ('74b37cd4-75aa-4871-b17b-a5160428e589', 'df960bb2-2647-4b0f-937f-ac3d26780913', 'Title 1', 'Description 1', 'pending', '2025-03-01 15:00:00'),
    ('7e2c88c7-2c9a-4c55-8820-d1e39bfea2f7', 'df960bb2-2647-4b0f-937f-ac3d26780913', 'Title 2', 'Description 2', 'in-progress', '2025-02-28 12:00:00'),
    ('d83ce117-0ee6-48f1-8a36-c50a4fffee5c', 'b293d9a9-1d1a-4729-a333-ea4435620b48', 'Title 3', NULL, 'completed', '2025-02-20 09:00:00');
