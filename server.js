const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shopparazzi_db',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.get('/api/store-prices', (req, res) => {
    const query = `
    SELECT stores.name as store_name, products.id as product_id, products.name as product_name, productprices.price
    FROM productprices
    JOIN products ON productprices.product_id = products.id
    JOIN stores ON productprices.store_id = stores.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching store prices:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Store prices fetched:', results); // Debugging

        const storeData = results.reduce((acc, item) => {
            const { store_name, product_id, product_name, price } = item;
            if (!acc[store_name]) {
                acc[store_name] = { name: store_name, products: [] };
            }
            acc[store_name].products.push({ id: product_id, name: product_name, price });
            return acc;
        }, {});

        res.json(Object.values(storeData));
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
