exports.isAdmin = (req, res, next) => {
    if (req.session.isAdmin) next();
    else res.redirect("/not-admin"); 
};

exports.notAdmin = (req, res, next) => {
    if (!req.session.isAdmin) next();
    else res.redirect("/not-user");
};