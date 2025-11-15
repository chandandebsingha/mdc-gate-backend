require('dotenv').config();
const { Pool } = require('pg');
(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('Running ALTER TABLE to change country -> varchar(100)');
    await pool.query("ALTER TABLE user_details ALTER COLUMN country TYPE varchar(100) USING country::varchar");
    console.log('ALTER TABLE completed');
  } catch (e) {
    console.error('ALTER ERROR', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();