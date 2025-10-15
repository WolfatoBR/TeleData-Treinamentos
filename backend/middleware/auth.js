const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../database/models/user"); // Importar o model User

async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        // Verificar o token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Buscar o usuário completo no banco de dados
        const user = await User.findByPk(decoded.user_id, {
            attributes: ['user_id', 'full_name', 'email', 'user_type', 'is_verified']
        });

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        // Adicionar dados do usuário à requisição
        req.user = {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            user_type: user.user_type,  // ← IMPORTANTE para o middleware isAdmin
            is_verified: user.is_verified
        };

        console.log("Usuário autenticado:", req.user);
        next();
    } catch (err) {
        console.log("Erro ao verificar token:", err.message);
        return res.status(403).json({ message: "Token inválido" });
    }
}

module.exports = authenticateToken;