const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");


function authMiddleware(req,res,next){
    const token = req.headers.authorization;
    const words=token.split(' ');
    const actualToken=words[1];

    if (!token || words[0]!='Bearer') {
        return res.status(403).json({});
    }



    jwt.verify(actualToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            
            res.status(401).send("Unauthorized");
        } else {
            console.log(decoded);
            req.userId=decoded.userId;
            // console.log(decoded);
            next();
        }
    });
}

module.exports={authMiddleware};