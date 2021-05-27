import jwt from 'jsonwebtoken';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader)
        return res.send({error: "No token provided!"});
    
    const parts = authHeader.split(' ');

    if(parts.length !== 2)
        return res.send({ error: "Token invalid!" });
    
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.send({ error: "Token malformatted!" });

    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if(err) return res.send({error: "Token invalid"});

        req.userId = decoded.id;
        return next();
    })
}