const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const secretKey = 'secretkey';

const routes = require('./routes')

require('dotenv').config();
app.use(express.json());


// testing server
app.get('/', (_req, res) => {
    res.send('Hello World');
    console.log('Working fine');
});

// login
app.post('/login', (_req, res) => {
    const user = {
        id: 1,
        username: 'anmol',
        email: 'test@gmail.com'
    }
    jwt.sign(
        {user}, secretKey,{expiresIn: '300s'},
        (error, token) => {
            if (error) {
                res.send('Token not generated');
            } else {
                res.json({token});
            }
        }
    )
});

// verify token (middleware)
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        req.token = token;

        jwt.verify(req.token, secretKey, (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    res.json({message: 'Token Expired'});
                } else {
                    res.json({message: 'Token Invalid'});
                }
                console.log('Error ', error);
            } else {
                req.authData = decoded.user;
                next()
            }
        });
    } else {
        res.json({message: 'Invalid Token'});
    }
};

app.post('/profile',verifyToken, (req, res) => {
    res.json({message: 'access granted', authData: req.authData});
    console.log(req.authData);
});

// routes
app.use('/api/data', routes);

// Server Port
const port = process.env.PORT;
app.listen(port, () => {console.log(`Server listening at http://localhost:${port}`);});