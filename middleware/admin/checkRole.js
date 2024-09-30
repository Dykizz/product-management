const checkRole = (requiredRole) => {
    return (req, res, next) => {
      const { role } = res.locals; 
  
      if (role && role.permissions.includes(requiredRole)) {
        next(); 
      } else {
        req.flash('danger','Bạn không có quyền thực hiện thao tác này!');
        return res.redirect('back');
      }
    };
  };

module.exports = checkRole;
  