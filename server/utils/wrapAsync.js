module.exports = (func) => {
    return function (req, res, next) {
        return func(req,res,next).catch(err=>{next(err)})
    }
};