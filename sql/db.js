const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

module.exports.getImages = () => {
    return db.query(`
        SELECT * FROM images
    
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
