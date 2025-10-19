const { createObjectCsvStringifier } = require('csv-writer');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const { Op } = require('sequelize');

// Importar models (ajuste os caminhos conforme sua estrutura)
const User = require('../database/models/user');
const Course = require('../database/models/course');
const Enrollment = require('../database/models/enrollment');
const Payment = require('../database/models/payment');
const Review = require('../database/models/review');
const Category = require('../database/models/category');

// ==================== HELPERS ====================

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

// ==================== EXPORTAÇÃO DE CURSOS ====================

exports.exportCoursesCSV = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator' }
      ],
      where: { deleted_at: null }
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'course_id', title: 'ID' },
        { id: 'title', title: 'Título' },
        { id: 'category', title: 'Categoria' },
        { id: 'level', title: 'Nível' },
        { id: 'price', title: 'Preço (R$)' },
        { id: 'total_students', title: 'Alunos' },
        { id: 'average_rating', title: 'Avaliação' },
        { id: 'is_published', title: 'Publicado' },
        { id: 'created_at', title: 'Criado em' }
      ]
    });

    const data = courses.map(course => ({
      course_id: course.course_id,
      title: course.title,
      category: course.category ? course.category.name : 'Sem categoria',
      level: course.level,
      price: course.price,
      total_students: course.total_students,
      average_rating: course.average_rating || 0,
      is_published: course.is_published ? 'Sim' : 'Não',
      created_at: formatDate(course.created_at)
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=cursos.csv');
    res.send('\uFEFF' + csvContent);
  } catch (error) {
    console.error('Erro ao exportar cursos CSV:', error);
    res.status(500).json({ error: 'Erro ao gerar CSV' });
  }
};

exports.exportCoursesPDF = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator' }
      ],
      where: { deleted_at: null }
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cursos.pdf');
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).fillColor('#1e40af').text('Relatório de Cursos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#6b7280').text(`Gerado em: ${formatDate(new Date())}`, { align: 'center' });
    doc.fontSize(10).text(`Total de cursos: ${courses.length}`, { align: 'center' });
    doc.moveDown(2);

    // Cursos
    courses.forEach((course, index) => {
      if (index > 0) doc.moveDown(1);
      
      doc.fontSize(14).fillColor('#2563eb').text(course.title, { underline: true });
      doc.moveDown(0.3);
      
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Categoria: ${course.category ? course.category.name : 'Sem categoria'}`);
      doc.text(`Nível: ${course.level}`);
      doc.text(`Preço: ${formatCurrency(course.price)}`);
      doc.text(`Alunos matriculados: ${course.total_students}`);
      doc.text(`Avaliação média: ${course.average_rating || 0} ⭐`);
      doc.text(`Status: ${course.is_published ? 'Publicado' : 'Rascunho'}`);
      doc.text(`Criado em: ${formatDate(course.created_at)}`);
      
      if (index < courses.length - 1) {
        doc.moveDown(0.3);
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar pagamentos PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};

exports.exportPaymentsExcel = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ]
    });

    const data = payments.map(payment => ({
      'ID': payment.payment_id,
      'Aluno': payment.enrollment?.student?.full_name || 'N/A',
      'Curso': payment.enrollment?.course?.title || 'N/A',
      'Valor (R$)': payment.amount,
      'Método': payment.payment_method,
      'Status': payment.status,
      'Parcelas': payment.installments,
      'Data': formatDate(payment.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagamentos');

    worksheet['!cols'] = [
      { wch: 8 }, { wch: 30 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 15 }
    ];

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=pagamentos.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar pagamentos Excel:', error);
    res.status(500).json({ error: 'Erro ao gerar Excel' });
  }
};

exports.exportPaymentsJSON = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ]
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=pagamentos.json');
    res.json(payments);
  } catch (error) {
    console.error('Erro ao exportar pagamentos JSON:', error);
    res.status(500).json({ error: 'Erro ao gerar JSON' });
  }
};

// ==================== EXPORTAÇÃO DE REVIEWS ====================

exports.exportReviewsCSV = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ],
      where: { deleted_at: null }
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'review_id', title: 'ID' },
        { id: 'student', title: 'Aluno' },
        { id: 'course', title: 'Curso' },
        { id: 'rating', title: 'Avaliação' },
        { id: 'comment', title: 'Comentário' },
        { id: 'created_at', title: 'Data' }
      ]
    });

    const data = reviews.map(review => ({
      review_id: review.review_id,
      student: review.enrollment?.student?.full_name || 'N/A',
      course: review.enrollment?.course?.title || 'N/A',
      rating: review.rating,
      comment: review.comment || 'Sem comentário',
      created_at: formatDate(review.created_at)
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=avaliacoes.csv');
    res.send('\uFEFF' + csvContent);
  } catch (error) {
    console.error('Erro ao exportar reviews CSV:', error);
    res.status(500).json({ error: 'Erro ao gerar CSV' });
  }
};

exports.exportReviewsPDF = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ],
      where: { deleted_at: null }
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=avaliacoes.pdf');
    doc.pipe(res);

    doc.fontSize(20).fillColor('#1e40af').text('Relatório de Avaliações', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#6b7280').text(`Gerado em: ${formatDate(new Date())}`, { align: 'center' });
    
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : 0;
    doc.fontSize(10).text(`Total de avaliações: ${reviews.length}`, { align: 'center' });
    doc.fontSize(10).text(`Média geral: ${avgRating} ⭐`, { align: 'center' });
    doc.moveDown(2);

    reviews.forEach((review, index) => {
      if (index > 0) doc.moveDown(1);
      
      doc.fontSize(12).fillColor('#2563eb').text(`Avaliação #${review.review_id}`);
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Aluno: ${review.enrollment?.student?.full_name || 'N/A'}`);
      doc.text(`Curso: ${review.enrollment?.course?.title || 'N/A'}`);
      doc.text(`Nota: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
      if (review.comment) {
        doc.text(`Comentário: ${review.comment}`);
      }
      doc.text(`Data: ${formatDate(review.created_at)}`);
      
      if (index < reviews.length - 1) {
        doc.moveDown(0.3);
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar reviews PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};

exports.exportReviewsExcel = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ],
      where: { deleted_at: null }
    });

    const data = reviews.map(review => ({
      'ID': review.review_id,
      'Aluno': review.enrollment?.student?.full_name || 'N/A',
      'Curso': review.enrollment?.course?.title || 'N/A',
      'Avaliação': review.rating,
      'Comentário': review.comment || 'Sem comentário',
      'Data': formatDate(review.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Avaliações');

    worksheet['!cols'] = [
      { wch: 8 }, { wch: 30 }, { wch: 35 }, { wch: 12 }, { wch: 50 }, { wch: 15 }
    ];

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=avaliacoes.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar reviews Excel:', error);
    res.status(500).json({ error: 'Erro ao gerar Excel' });
  }
};

exports.exportReviewsJSON = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ],
      where: { deleted_at: null }
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=avaliacoes.json');
    res.json(reviews);
  } catch (error) {
    console.error('Erro ao exportar reviews JSON:', error);
    res.status(500).json({ error: 'Erro ao gerar JSON' });
  }
};

// ==================== RELATÓRIO COMPLETO ====================

exports.exportCompleteReport = async (req, res) => {
  try {
    // Buscar todas as estatísticas
    const totalUsers = await User.count({ where: { deleted_at: null } });
    const totalCourses = await Course.count({ where: { deleted_at: null } });
    const totalEnrollments = await Enrollment.count();
    const completedCourses = await Enrollment.count({ where: { completed_at: { [Op.not]: null } } });
    
    const payments = await Payment.findAll({ where: { status: 'completed' } });
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    const reviews = await Review.findAll({ where: { deleted_at: null } });
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : 0;

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_completo_teledata.pdf');
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(24).fillColor('#1e40af').text('TELEDATA ACADEMY', { align: 'center' });
    doc.fontSize(16).fillColor('#6b7280').text('Relatório Completo da Plataforma', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Gerado em: ${formatDate(new Date())}`, { align: 'center' });
    doc.moveDown(2);

    // Estatísticas Gerais
    doc.fontSize(16).fillColor('#1e40af').text('📊 Estatísticas Gerais', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000000');
    doc.text(`• Total de Usuários: ${totalUsers}`);
    doc.text(`• Total de Cursos: ${totalCourses}`);
    doc.text(`• Total de Matrículas: ${totalEnrollments}`);
    doc.text(`• Cursos Concluídos: ${completedCourses}`);
    doc.text(`• Taxa de Conclusão: ${totalEnrollments > 0 ? ((completedCourses / totalEnrollments) * 100).toFixed(1) : 0}%`);
    doc.moveDown(1.5);

    // Financeiro
    doc.fontSize(16).fillColor('#1e40af').text('💰 Financeiro', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000000');
    doc.text(`• Receita Total: ${formatCurrency(totalRevenue)}`);
    doc.text(`• Pagamentos Completados: ${payments.length}`);
    doc.text(`• Ticket Médio: ${formatCurrency(payments.length > 0 ? totalRevenue / payments.length : 0)}`);
    doc.moveDown(1.5);

    // Avaliações
    doc.fontSize(16).fillColor('#1e40af').text('⭐ Avaliações', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#000000');
    doc.text(`• Total de Avaliações: ${reviews.length}`);
    doc.text(`• Média Geral: ${avgRating} estrelas`);
    doc.text(`• Avaliações 5 estrelas: ${reviews.filter(r => r.rating === 5).length}`);
    doc.text(`• Avaliações 4 estrelas: ${reviews.filter(r => r.rating === 4).length}`);
    doc.text(`• Avaliações 3 estrelas: ${reviews.filter(r => r.rating === 3).length}`);
    doc.text(`• Avaliações 1-2 estrelas: ${reviews.filter(r => r.rating <= 2).length}`);
    doc.moveDown(2);

    // Top 5 Cursos
    const topCourses = await Course.findAll({
      where: { deleted_at: null, is_published: true },
      order: [['total_students', 'DESC']],
      limit: 5,
      include: [{ model: Category, as: 'category' }]
    });

    if (topCourses.length > 0) {
      doc.fontSize(16).fillColor('#1e40af').text('🏆 Top 5 Cursos Mais Populares', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#000000');
      
      topCourses.forEach((course, index) => {
        doc.text(`${index + 1}. ${course.title}`);
        doc.fontSize(9).fillColor('#6b7280');
        doc.text(`   ${course.total_students} alunos • ${course.average_rating || 0} ⭐ • ${formatCurrency(course.price)}`, { indent: 20 });
        doc.fontSize(11).fillColor('#000000');
        doc.moveDown(0.3);
      });
    }

    // Rodapé
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#9ca3af').text(
      '─'.repeat(80),
      { align: 'center' }
    );
    doc.text('Teledata Academy - Plataforma de Cursos Online', { align: 'center' });
    doc.text('Este relatório contém informações confidenciais', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório completo:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
};

exports.exportCoursesExcel = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator' }
      ],
      where: { deleted_at: null }
    });

    const data = courses.map(course => ({
      'ID': course.course_id,
      'Título': course.title,
      'Categoria': course.category ? course.category.name : 'Sem categoria',
      'Nível': course.level,
      'Preço (R$)': course.price,
      'Alunos': course.total_students,
      'Avaliação': course.average_rating || 0,
      'Publicado': course.is_published ? 'Sim' : 'Não',
      'Criado em': formatDate(course.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cursos');

    worksheet['!cols'] = [
      { wch: 5 }, { wch: 40 }, { wch: 20 }, { wch: 15 },
      { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
    ];

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=cursos.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar cursos Excel:', error);
    res.status(500).json({ error: 'Erro ao gerar Excel' });
  }
};

exports.exportCoursesJSON = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator' }
      ],
      where: { deleted_at: null }
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=cursos.json');
    res.json(courses);
  } catch (error) {
    console.error('Erro ao exportar cursos JSON:', error);
    res.status(500).json({ error: 'Erro ao gerar JSON' });
  }
};

// ==================== EXPORTAÇÃO DE USUÁRIOS ====================

exports.exportUsersCSV = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { deleted_at: null },
      attributes: ['user_id', 'full_name', 'email', 'user_type', 'is_verified', 'created_at']
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'user_id', title: 'ID' },
        { id: 'full_name', title: 'Nome Completo' },
        { id: 'email', title: 'Email' },
        { id: 'user_type', title: 'Tipo' },
        { id: 'is_verified', title: 'Verificado' },
        { id: 'created_at', title: 'Cadastrado em' }
      ]
    });

    const data = users.map(user => ({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      is_verified: user.is_verified ? 'Sim' : 'Não',
      created_at: formatDate(user.created_at)
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.csv');
    res.send('\uFEFF' + csvContent);
  } catch (error) {
    console.error('Erro ao exportar usuários CSV:', error);
    res.status(500).json({ error: 'Erro ao gerar CSV' });
  }
};

exports.exportUsersPDF = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { deleted_at: null },
      attributes: ['user_id', 'full_name', 'email', 'user_type', 'is_verified', 'created_at']
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.pdf');
    doc.pipe(res);

    doc.fontSize(20).fillColor('#1e40af').text('Relatório de Usuários', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#6b7280').text(`Gerado em: ${formatDate(new Date())}`, { align: 'center' });
    doc.fontSize(10).text(`Total de usuários: ${users.length}`, { align: 'center' });
    doc.moveDown(2);

    users.forEach((user, index) => {
      if (index > 0) doc.moveDown(1);
      
      doc.fontSize(12).fillColor('#2563eb').text(user.full_name);
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Email: ${user.email}`);
      doc.text(`Tipo: ${user.user_type}`);
      doc.text(`Verificado: ${user.is_verified ? 'Sim' : 'Não'}`);
      doc.text(`Cadastrado em: ${formatDate(user.created_at)}`);
      
      if (index < users.length - 1) {
        doc.moveDown(0.3);
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar usuários PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};

exports.exportUsersExcel = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { deleted_at: null },
      attributes: ['user_id', 'full_name', 'email', 'user_type', 'is_verified', 'created_at']
    });

    const data = users.map(user => ({
      'ID': user.user_id,
      'Nome Completo': user.full_name,
      'Email': user.email,
      'Tipo': user.user_type,
      'Verificado': user.is_verified ? 'Sim' : 'Não',
      'Cadastrado em': formatDate(user.created_at)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');

    worksheet['!cols'] = [
      { wch: 5 }, { wch: 30 }, { wch: 35 }, { wch: 15 }, { wch: 12 }, { wch: 15 }
    ];

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar usuários Excel:', error);
    res.status(500).json({ error: 'Erro ao gerar Excel' });
  }
};

exports.exportUsersJSON = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { deleted_at: null },
      attributes: ['user_id', 'full_name', 'email', 'user_type', 'is_verified', 'created_at']
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.json');
    res.json(users);
  } catch (error) {
    console.error('Erro ao exportar usuários JSON:', error);
    res.status(500).json({ error: 'Erro ao gerar JSON' });
  }
};

// ==================== EXPORTAÇÃO DE MATRÍCULAS ====================

exports.exportEnrollmentsCSV = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'enrollment_id', title: 'ID' },
        { id: 'student_name', title: 'Aluno' },
        { id: 'course_title', title: 'Curso' },
        { id: 'price_paid', title: 'Valor Pago (R$)' },
        { id: 'progress', title: 'Progresso (%)' },
        { id: 'enrolled_at', title: 'Matrícula em' },
        { id: 'status', title: 'Status' }
      ]
    });

    const data = enrollments.map(enrollment => ({
      enrollment_id: enrollment.enrollment_id,
      student_name: enrollment.student ? enrollment.student.full_name : 'N/A',
      course_title: enrollment.course ? enrollment.course.title : 'N/A',
      price_paid: enrollment.price_paid,
      progress: enrollment.progress_percentage,
      enrolled_at: formatDate(enrollment.enrolled_at),
      status: enrollment.completed_at ? 'Concluído' : 'Em andamento'
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=matriculas.csv');
    res.send('\uFEFF' + csvContent);
  } catch (error) {
    console.error('Erro ao exportar matrículas CSV:', error);
    res.status(500).json({ error: 'Erro ao gerar CSV' });
  }
};

exports.exportEnrollmentsPDF = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=matriculas.pdf');
    doc.pipe(res);

    doc.fontSize(20).fillColor('#1e40af').text('Relatório de Matrículas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#6b7280').text(`Gerado em: ${formatDate(new Date())}`, { align: 'center' });
    doc.fontSize(10).text(`Total de matrículas: ${enrollments.length}`, { align: 'center' });
    doc.moveDown(2);

    enrollments.forEach((enrollment, index) => {
      if (index > 0) doc.moveDown(1);
      
      doc.fontSize(12).fillColor('#2563eb').text(`Matrícula #${enrollment.enrollment_id}`);
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Aluno: ${enrollment.student ? enrollment.student.full_name : 'N/A'}`);
      doc.text(`Curso: ${enrollment.course ? enrollment.course.title : 'N/A'}`);
      doc.text(`Valor pago: ${formatCurrency(enrollment.price_paid)}`);
      doc.text(`Progresso: ${enrollment.progress_percentage}%`);
      doc.text(`Matriculado em: ${formatDate(enrollment.enrolled_at)}`);
      doc.text(`Status: ${enrollment.completed_at ? 'Concluído' : 'Em andamento'}`);
      
      if (index < enrollments.length - 1) {
        doc.moveDown(0.3);
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar matrículas PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};

exports.exportEnrollmentsExcel = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    const data = enrollments.map(enrollment => ({
      'ID': enrollment.enrollment_id,
      'Aluno': enrollment.student ? enrollment.student.full_name : 'N/A',
      'Curso': enrollment.course ? enrollment.course.title : 'N/A',
      'Valor Pago (R$)': enrollment.price_paid,
      'Progresso (%)': enrollment.progress_percentage,
      'Matriculado em': formatDate(enrollment.enrolled_at),
      'Status': enrollment.completed_at ? 'Concluído' : 'Em andamento'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matrículas');

    worksheet['!cols'] = [
      { wch: 8 }, { wch: 30 }, { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 15 }
    ];

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=matriculas.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao exportar matrículas Excel:', error);
    res.status(500).json({ error: 'Erro ao gerar Excel' });
  }
};

exports.exportEnrollmentsJSON = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=matriculas.json');
    res.json(enrollments);
  } catch (error) {
    console.error('Erro ao exportar matrículas JSON:', error);
    res.status(500).json({ error: 'Erro ao gerar JSON' });
  }
};

// ==================== EXPORTAÇÃO DE PAGAMENTOS ====================

exports.exportPaymentsCSV = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ]
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'payment_id', title: 'ID' },
        { id: 'student', title: 'Aluno' },
        { id: 'course', title: 'Curso' },
        { id: 'amount', title: 'Valor (R$)' },
        { id: 'method', title: 'Método' },
        { id: 'status', title: 'Status' },
        { id: 'installments', title: 'Parcelas' },
        { id: 'created_at', title: 'Data' }
      ]
    });

    const data = payments.map(payment => ({
      payment_id: payment.payment_id,
      student: payment.enrollment?.student?.full_name || 'N/A',
      course: payment.enrollment?.course?.title || 'N/A',
      amount: payment.amount,
      method: payment.payment_method,
      status: payment.status,
      installments: payment.installments,
      created_at: formatDate(payment.created_at)
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=pagamentos.csv');
    res.send('\uFEFF' + csvContent);
  } catch (error) {
    console.error('Erro ao exportar pagamentos CSV:', error);
    res.status(500).json({ error: 'Erro ao gerar CSV' });
  }
};
exports.exportPaymentsPDF = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            { model: User, as: 'student' },
            { model: Course, as: 'course' }
          ]
        }
      ]
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=pagamentos.pdf');
    doc.pipe(res);

    doc.fontSize(20).fillColor('#1e40af').text('Relatório de Pagamentos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('#6b7280').text(`Gerado em: ${formatDate(new Date())}`, { align: 'center' });
    
    const totalRevenue = payments.reduce((sum, p) => p.status === 'completed' ? sum + parseFloat(p.amount) : sum, 0);
    doc.fontSize(10).text(`Total de pagamentos: ${payments.length}`, { align: 'center' });
    doc.fontSize(10).text(`Receita total (completados): ${formatCurrency(totalRevenue)}`, { align: 'center' });
    doc.moveDown(2);

    payments.forEach((payment, index) => {
      if (index > 0) doc.moveDown(1);
      
      doc.fontSize(12).fillColor('#2563eb').text(`Pagamento #${payment.payment_id}`);
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Aluno: ${payment.enrollment?.student?.full_name || 'N/A'}`);
      doc.text(`Curso: ${payment.enrollment?.course?.title || 'N/A'}`);
      doc.text(`Valor: ${formatCurrency(payment.amount)}`);
      doc.text(`Método: ${payment.payment_method}`);
      doc.text(`Status: ${payment.status}`);
      doc.text(`Parcelas: ${payment.installments}x`);
      doc.text(`Data: ${formatDate(payment.created_at)}`);
      
      if (index < payments.length - 1) {
        doc.moveDown(0.3);
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar pagamentos PDF:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
};
