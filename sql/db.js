const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(`
        SELECT * FROM images
        ORDER BY id DESC
        LIMIT 3;
    
    `);
};
module.exports.addImage = (fileUrl, username, title, description) => {
    return db.query(
        `
        INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)
        RETURNING id, url, username, title, description
    `,
        [fileUrl, username, title, description]
    );
};
module.exports.pullImage = (id) => {
    return db.query(
        `
        SELECT * FROM images WHERE id = $1
    
    `,
        [id]
    );
};

module.exports.pullComment = (id) => {
    return db.query(
        `
        SELECT * FROM comments WHERE image_id = $1
    
    `,
        [id]
    );
};

module.exports.postComment = (text, username, image_id) => {
    return db.query(
        `
        INSERT INTO comments (text, username, image_id) VALUES ($1, $2, $3)
        RETURNING *
    
    `,
        [text, username, image_id]
    );
};

module.exports.getMoreImages = (lastId) => {
    return db.query(
        `
        SELECT url, title, id, username, description, created_at, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3;
    `,
        [lastId]
    );
};
