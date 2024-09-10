const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12730521',
    password: 'FAAMeepGU9',
    database: 'sql12730521',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM curd');
        res.json(rows);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

app.post('/Create', async (req, res) => {
    const { FirstName, LastName,Age,PhNum,Email } = req.body;
    try {
        const [result] = await pool.promise().query('INSERT INTO curd (FirstName, LastName, Age, PhNum, Email) VALUES (?, ?, ?,?,?)', [FirstName, LastName, Age, PhNum, Email]);
        res.json({ id: result.insertId, FirstName, LastName, Age, PhNum, Email });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
)

app.put('/Update/:id', async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Age, PhNum, Email } = req.body;
    try {
        const [result] = await pool.promise().query('UPDATE curd SET FirstName = ?, LastName = ?, Age = ?, PhNum = ?, Email = ? WHERE id = ?', [FirstName, LastName, Age, PhNum, Email, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ id, FirstName, LastName, Age, PhNum, Email });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
)


app.delete('/Delete/:id', async (req, res) =>{
    const {id} = req.params;
    try {
        const [result] = await pool.promise().query('DELETE FROM curd WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
} )













app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});

  

