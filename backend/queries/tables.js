const users_table = `
    CREATE TABLE users (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           role VARCHAR(255) DEFAULT 'users',
                           username VARCHAR(255) NOT NULL UNIQUE,
                           email VARCHAR(255) NOT NULL UNIQUE,
                           password VARCHAR(255) NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const products_table = `
    CREATE TABLE products (
                              id SERIAL PRIMARY KEY,
                              name VARCHAR(255) NOT NULL,
                              description TEXT,
                              price DECIMAL(10, 2) NOT NULL,
                              stock_quantity INT NOT NULL DEFAULT 0,
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const orders_table = `
    CREATE TABLE orders (
                            id SERIAL PRIMARY KEY,
                            user_id INT NOT NULL,
                            status VARCHAR(50) NOT NULL DEFAULT 'pending',
                            total_amount DECIMAL(10, 2) NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
`;

const products_sold_table = `
    CREATE TABLE products_sold (
                                   id SERIAL PRIMARY KEY,
                                   product_id INT NOT NULL,
                                   order_id INT NOT NULL,
                                   quantity_sold INT NOT NULL,
                                   sold_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                                   FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
`;

module.exports = {
    users_table,
    products_table,
    orders_table,
    products_sold_table
};