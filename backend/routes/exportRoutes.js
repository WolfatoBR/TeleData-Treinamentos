const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const exportController = require("../controllers/exportController");

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.user_type === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
};

// ==================== EXPORTAÇÃO DE CURSOS ====================

// Exportar todos os cursos em CSV
router.get("/courses/csv", authenticateToken, isAdmin, exportController.exportCoursesCSV);

// Exportar todos os cursos em PDF
router.get("/courses/pdf", authenticateToken, isAdmin, exportController.exportCoursesPDF);

// Exportar todos os cursos em Excel
router.get("/courses/excel", authenticateToken, isAdmin, exportController.exportCoursesExcel);

// Exportar todos os cursos em JSON
router.get("/courses/json", authenticateToken, isAdmin, exportController.exportCoursesJSON);

// ==================== EXPORTAÇÃO DE USUÁRIOS ====================

router.get("/users/csv", authenticateToken, isAdmin, exportController.exportUsersCSV);
router.get("/users/pdf", authenticateToken, isAdmin, exportController.exportUsersPDF);
router.get("/users/excel", authenticateToken, isAdmin, exportController.exportUsersExcel);
router.get("/users/json", authenticateToken, isAdmin, exportController.exportUsersJSON);

// ==================== EXPORTAÇÃO DE MATRÍCULAS ====================

router.get("/enrollments/csv", authenticateToken, isAdmin, exportController.exportEnrollmentsCSV);
router.get("/enrollments/pdf", authenticateToken, isAdmin, exportController.exportEnrollmentsPDF);
router.get("/enrollments/excel", authenticateToken, isAdmin, exportController.exportEnrollmentsExcel);
router.get("/enrollments/json", authenticateToken, isAdmin, exportController.exportEnrollmentsJSON);

// ==================== EXPORTAÇÃO DE PAGAMENTOS ====================

router.get("/payments/csv", authenticateToken, isAdmin, exportController.exportPaymentsCSV);
router.get("/payments/pdf", authenticateToken, isAdmin, exportController.exportPaymentsPDF);
router.get("/payments/excel", authenticateToken, isAdmin, exportController.exportPaymentsExcel);
router.get("/payments/json", authenticateToken, isAdmin, exportController.exportPaymentsJSON);

// ==================== EXPORTAÇÃO DE REVIEWS ====================

router.get("/reviews/csv", authenticateToken, isAdmin, exportController.exportReviewsCSV);
router.get("/reviews/pdf", authenticateToken, isAdmin, exportController.exportReviewsPDF);
router.get("/reviews/excel", authenticateToken, isAdmin, exportController.exportReviewsExcel);
router.get("/reviews/json", authenticateToken, isAdmin, exportController.exportReviewsJSON);

// ==================== RELATÓRIO COMPLETO ====================

// Relatório completo da plataforma em PDF
router.get("/report/complete", authenticateToken, isAdmin, exportController.exportCompleteReport);

module.exports = router;