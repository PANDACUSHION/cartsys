const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library

class User {
    static async create({ name, username, email, password, role }) {
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
        const query = `INSERT INTO users (name, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, username, email, role, created_at;`;
        const values = [name, username, email, hashedPassword, role];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const query = `SELECT id, name, username, email, password, role, created_at FROM users WHERE username = $1;`;
        const result = await db.query(query, [username]);
        return result.rows[0];
    }


    static async findOne(conditions) {
        const validFields = ['id', 'username', 'email', 'role'];
        const whereConditions = [];
        const values = [];
        let paramCounter = 1;

        Object.entries(conditions).forEach(([key, value]) => {
            if (validFields.includes(key)) {
                whereConditions.push(`${key} = $${paramCounter}`);
                values.push(value);
                paramCounter++;
            }
        });

        if (whereConditions.length === 0) {
            throw new Error('No valid search conditions provided');
        }

        const query = `SELECT id, name, username, email, role, created_at, password FROM users WHERE ${whereConditions.join(' AND ')} LIMIT 1;`;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async validate({ username, password }) {
        const user = await this.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        const isValid = await bcrypt.compare(password, user.password);  // Compare passwords
        if (!isValid) {
            throw new Error('Invalid password');
        }
        const { password: _, ...userData } = user;

        // Generate JWT token
        const token = this.generateJWT(user.id, user.role); // Pass user ID and role to generate the token
        return { user: userData, token };
    }
    static generateJWT(userId, role) {
        const payload = { userId, role }; // Information you want to include in the token
        const secretKey = 'a2e189c55fc5dd9f910300a5bab0310999c4e2a5ddb29de3f23e3a1a6f5bcbc7dafdfe474ce1a0c13695c629a545fb42f388d876d195dfb14f6a7a020ff011beb01fb8e3214c869ea237458712a5c745eb96b76d989f2596a1c199d222907984c1c3199e5126833ef2315b17729b7c5c94af363a8040e22c3120d62145c004dc'
        const options = { expiresIn: '1h' }; // Token expiration time
        return jwt.sign(payload, secretKey, options);
    }
}

module.exports = User;
