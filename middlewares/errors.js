exports.notFound = (req, res, next) => {
    const err = new Error('404 page not found');
    err.status = 404;
    next(err);
};

exports.catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err));
    }
};

exports.catchErrors = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500);
    return res.render('error', {
        message: err.message,
        status: err.status || 500,
        error: err
    });
};