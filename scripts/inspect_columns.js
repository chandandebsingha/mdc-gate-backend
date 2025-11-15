require('dotenv').config();
const { Pool } = require('pg');
(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const res = await pool.query("SELECT column_name, data_type, udt_name, ordinal_position FROM information_schema.columns WHERE table_name='user_details' ORDER BY ordinal_position");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();