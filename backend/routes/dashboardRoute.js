const express =  require ("express");
const router = express.Router();
const User = require("../database/models/user"); // Importa meu model User
const ErrorModel = require("../database/models/error"); // Importa meu model Error
const { handleError} = require("../utils/handleError"); // Importa minha função de tratar erro.


router.get("/", async (req, res) => {
  try {
    const totalUsers = await User.count(); // Conta todos os usuarios da tabela User.
    const onlineUsers = await User.count({ where: { is_online: true } }); // Pega todos os usuarios que tem o status Online True
    const users = await User.findAll({raw: true,order:[["user_id","DESC"]]}); // Busca todos os usuarios da tabela em ordem decescente pelo id.
    const metaUsers = 500; // Uma constante que define a meta de usuarios.
    const Usersporcent = (totalUsers / metaUsers) * 100; // Uma lógica básica que calcula a porcentagem do usuarios em relação a meta.
    const UsersporcentFixed = Usersporcent.toFixed(2); // Limita o numero de casas decimais paa 2. 
    const systemErrors = await ErrorModel.count(); // Busca todos os erros do sistema.

    const Errorsporcent = (systemErrors/1000) * 100; // Calcula a porcentagem de erros em relação ao limite de 1000 erros.
    const ErrorsporcentFixed = Errorsporcent.toFixed(2);

    res.render("administrador", { 
      totalUsers, 
      onlineUsers,
      users , 
      UsersporcentFixed,
      ErrorsporcentFixed }); // Renderiza a pagina mandando as variaveis pra ela.
    
  } catch (error) {
    await handleError(error,res,ErrorModel);

  }
  
});


module.exports = router;