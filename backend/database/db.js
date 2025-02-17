const { Pool } = require('pg');
const {users_table, products_table, orders_table, products_sold_table} = require('../queries/tables.js');

// Create a single pool instance to be reused across the application
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cart',
    password: 'root',
    port: 5432,
});

// Function to initialize the database
async function initializeDatabase() {
    const client = await pool.connect();
    try {
        // Start a transaction
        await client.query('BEGIN');

        // Check if tables exist before creating them
        const tablesExist = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);

        if (!tablesExist.rows[0].exists) {
            // Execute table creation queries in the correct order
            await client.query(users_table);
            await client.query(products_table);
            await client.query(orders_table);
            await client.query(products_sold_table);

            // Commit the transaction
            await client.query('COMMIT');
            console.log('Tables created successfully!');
        } else {
            await client.query('COMMIT');
            console.log('Tables already exist, skipping initialization.');
        }
    } catch (error) {
        // Rollback in case of error
        await client.query('ROLLBACK');
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        // Release the client back to the pool
        client.release();
    }
}

// Export the initialization function and query method
module.exports = {
    initializeDatabase,
    query: (text, params) => pool.query(text, params),
    pool, // Export pool for potential direct access if needed
};