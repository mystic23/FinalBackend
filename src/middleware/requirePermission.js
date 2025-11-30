module.exports = (permissionField) => {
  return (req, res, next) => {
    if (!req.user || !req.user[permissionField]) {
      return res.status(403).json({ message: 'Permiso denegado' });
    }
    next();
  };
};
