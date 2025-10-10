// utils/handleError.js
async function handleError(error, res, ErrorCounter) {
  console.error("Error fetching users:", error);

  const statusCode = error.status || 500;
  const messageCode = error.message || "Erro interno do servidor";

  try {
    await ErrorCounter.create({
      error_type: statusCode,
      error_message: messageCode,
    });
    
  } catch (dbError) {
    const aviso = alert("Falha ao registrar o erro no banco de dados.");
    console.error("Falha ao registrar o erro:", dbError);

  }

  
}

module.exports = { handleError };