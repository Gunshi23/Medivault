export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user?.role || 'Guest'}' is not authorized for this operation.`
      });
    }
    next();
  };
}
