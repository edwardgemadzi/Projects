const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        console.log('❌ No token in cookie');
        return res.status(401).json({message: 'No token, unauthorised'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('✅ Token verified. Decoded user:', decoded);
        next();
    }catch{
        console.error('❌ Token invalid or expired');
        return res.status(401).json({message: 'Invalid token'});
    }
}