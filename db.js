const { Pool } = require('pg');  

const pool = new Pool({
    connectionString:'postgresql://erasyl:vSk7VBf0TwoT1DE0UuexUGr1uWHYd3n5@dpg-d28airogjchc7394jsig-a.oregon-postgres.render.com/myproject_db_532s',
    ssl:{rejectUnauthorized:false}
});

module.exports = pool;
