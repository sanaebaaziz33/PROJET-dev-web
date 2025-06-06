const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, 'admitdb', 'admitdb.sqlite'));

app.use(bodyParser.json());

// 🔥 Servir les fichiers statiques depuis la racine
app.use(express.static(__dirname));

// 🔐 Route de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: 'Erreur serveur' });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          photo: user.photo || 'default-user.png'
        }
      });
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
