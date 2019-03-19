// implement your API here
const express = require('express');
const cors = require('cors');
const db = require('./data/db');
const server = express();
server.use(express.json());
server.use(cors());

// Delivers 'server running' response:
server.get('/', (req, res) => {
  res.send('Server running...');
});

// Fetches users array:
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: 'no users to return' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' });
    });
});

// Fetches a user:
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user information could not be retrieved.' });
    });
});

// Adds a user:
server.post('/api/users', (req, res) => {
  const user = req.body;
  if (user.name && user.bio) {
    db.insert(user)
      .then(user => res.status(201).json(user))
      .catch(err => res.status(500).json({ message: 'error adding user' }));
  } else {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
});

// Deletes a user:
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  let deletedUser;
  db.findById(id).then(user => (deletedUser = user));
  db.remove(id)
    .then(user => {
      if (user === 1) {
        // Sends general 'success' code, then ends the transmission (I forgot the proper name) since there is no need to send any other information.
        res.status(200).json(deletedUser);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'error deleting user' });
    });
});

// Updates a user:
server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const name = req.body.name;
  const bio = req.body.bio;
  db.update(id, user)
    .then(userEdit => {
      if (!id) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      } else if (!name || !bio) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user.' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user information could not be modified.' });
    });
});

server.listen(4000, () => {
  console.log('\n** API up and running on port 4000 **');
});
