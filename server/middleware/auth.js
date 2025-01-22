import jwt from "jsonwebtoken";

export const jwtVerify = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No Authorization header provided");
    return res.status(401).json({ msg: "Token is not provided" });
  }

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.employee = decoded.employee;
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ msg: `Token is not valid: ${err.message}` });
    }
  } else {
    console.error("Authorization header format is invalid");
    return res.status(400).json({ msg: "Authorization header format is invalid" });
  }
};
