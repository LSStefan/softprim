require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// functie validare mail
const esteEmailValid = (email) => {
    if (!email || typeof email !== 'string') 
        return false;

    if (email.length > 150) 
        return false;

    //sa aiba un singur @
    const parti = email.split('@');
    if (parti.length !== 2)
         return false;

    const utilizator = parti[0]; 
    const domeniu = parti[1]; 

    
    if (utilizator.length === 0 || domeniu.length === 0)
         return false;

    // dommeniul trb sa contina un punct si sa nu se termine in el
    if (!domeniu.includes('.') || domeniu.startsWith('.') || domeniu.endsWith('.')) {
        return false;
    }

    if (email.includes(' ')) 
        return false;

    return true;
};


// lista produselor (optional filtrare dupa categorie)
app.get('/api/products', async (req, res) => {
    try {
        const { category_id } = req.query;

        if (category_id !== undefined) {
            const catId = parseInt(category_id);
            if (isNaN(catId) || catId <= 0) {
                return res.status(400).json({ error: "category_id invalid (trebuie sa fie numar intreg pozitiv)" });
            }
        }

        let query = `
            SELECT p.id, p.name, p.price, p.stock, p.category_id, c.name as category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
        `;
        let params = [];

        if (category_id) {
            query += " WHERE p.category_id = ?";
            params.push(category_id);
        }

        const [products] = await db.query(query, params);
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ error: "Eroare la server" });
    }
});

// detaliile unui produs dupa id
app.get('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "ID invalid" });
        }

        const query = `
            SELECT p.*, c.name as category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Produsul nu a fost gasit" });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: "Eroare la server" });
    }
});

// plasarea unei comenzi
app.post('/api/orders', async (req, res) => {
    const { product_id, quantity, customer_email } = req.body;

    // 1. Validari de baza
    if (!product_id || !quantity || !customer_email) {
        return res.status(400).json({ error: "Lipsesc date obligatorii" });
    }

    if (quantity <= 0 || !esteEmailValid(customer_email)) {
        return res.status(400).json({ error: "Datele introduse sunt invalide" });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // verificare existenta produsului si stocului
        const [products] = await connection.query(
            "SELECT price, stock FROM products WHERE id = ? FOR UPDATE", 
            [product_id]
        );

        if (products.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Produsul nu exista" });
        }

        const product = products[0];
        if (product.stock < quantity) {
            await connection.rollback();
            return res.status(400).json({ error: "Stoc insuficient" });
        }

        const total = product.price * quantity;
        await connection.query(
            "UPDATE products SET stock = stock - ? WHERE id = ?", 
            [quantity, product_id]
        );

        const [result] = await connection.query(
            "INSERT INTO orders (product_id, quantity, total, customer_email, created_at) VALUES (?, ?, ?, ?, NOW())",
            [product_id, quantity, total, customer_email]
        );

        await connection.commit();

        res.status(201).json({
            order_id: result.insertId,
            product_id,
            quantity,
            total,
            created_at: new Date()
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Eroare la procesarea comenzii" });
    } finally {
        connection.release();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server activ pe portul ${PORT}`));