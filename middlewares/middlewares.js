const addId = (req, res, next) => {
  req.userId = {
    _id: "6464f05fa4cee3ff70ab6a2b",
  };
  next();
}
module.exports = {addId}