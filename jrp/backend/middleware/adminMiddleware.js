const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
};

exports.adminMiddleware = adminMiddleware;
exports.requireAdmin = adminMiddleware; // Keep for backward compatibility