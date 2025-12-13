const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied: role not found"
      });
    }

    // ✅ Normalize role values
    const userRole = String(req.user.role).toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r =>
      String(r).toLowerCase()
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions"
      });
    }

    next();
  };
};

export default roleMiddleware;
