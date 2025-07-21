// server/routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ GET all employees
router.get('/', (req, res) => {
  db.query('SELECT * FROM employees', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// ✅ ADD employee (check for duplicate email)
router.post('/', (req, res) => {
  const { name, email, department, gender } = req.body;

  if (!name || !email || !department || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM employees WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    db.query(
      'INSERT INTO employees (name, email, department, gender) VALUES (?, ?, ?, ?)',
      [name, email, department, gender],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, message: 'Employee added successfully' });
      }
    );
  });
});

// ✅ DELETE employee
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Employee deleted successfully' });
  });
});

// ✅ UPDATE employee (check for email duplicates)
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, department, gender } = req.body;

  if (!name || !email || !department || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'SELECT * FROM employees WHERE email = ? AND id != ?',
    [email, id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length > 0) {
        return res.status(409).json({ message: 'Email already in use by another employee' });
      }

      db.query(
        'UPDATE employees SET name = ?, email = ?, department = ?, gender = ? WHERE id = ?',
        [name, email, department, gender, id],
        (err) => {
          if (err) return res.status(500).send(err);
          res.json({ message: 'Employee updated successfully' });
        }
      );
    }
  );
});

module.exports = router;
