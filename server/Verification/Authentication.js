const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    try{
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }
       const verified = jwt.verify(token,process.env.Key);
       req.user = verified;
       next();

    }
    catch(err){
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateToken;