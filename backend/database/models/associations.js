// associations.js
const User = require('./user');
const Course = require('./course');
const Category = require('./category');
const Enrollment = require('./enrollment');
const Payment = require('./payment');
const Review = require('./review');

// ==================== Course <-> Category ====================
Course.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Course, { foreignKey: 'category_id', as: 'courses' });

// ==================== Course <-> User (creator) ====================
Course.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Course, { foreignKey: 'created_by', as: 'created_courses' });

// ==================== Enrollment <-> User ====================
Enrollment.belongsTo(User, { foreignKey: 'user_id', as: 'student' });
User.hasMany(Enrollment, { foreignKey: 'user_id', as: 'enrollments' });

// ==================== Enrollment <-> Course ====================
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });

// ==================== Payment <-> Enrollment ====================
Payment.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
Enrollment.hasMany(Payment, { foreignKey: 'enrollment_id', as: 'payments' });

// ==================== Review <-> Enrollment ====================
Review.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
Enrollment.hasOne(Review, { foreignKey: 'enrollment_id', as: 'review' });

// ==================== Exportar modelos ====================
module.exports = {
  User,
  Course,
  Category,
  Enrollment,
  Payment,
  Review
};
