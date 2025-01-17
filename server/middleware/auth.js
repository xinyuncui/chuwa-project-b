import jwt from "jsonwebtoken";

export const jwtVerify = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ msg: "Token is not provided" });

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    // console.log('this is token', token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.employee = decoded.employee;
      console.log(decoded.employee);
      next();
    } catch (err) {
      res.status(401).json({ msg: `Token is not valid, ${err}` });
    }
  }
};
