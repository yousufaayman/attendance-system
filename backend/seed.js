const { sequelize, Admin, Room, Course, Teacher, Student, Group, Class, AttendanceRecord } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  // Create an admin
  await Admin.create({ name: 'Yousuf Ayman', email: 'yousuf@example.com', password: 'adminpassword123' });

  // Create some teachers
  const teacher1 = await Teacher.create({ name: 'John Doe', email: 'john.doe@example.com', password: 'password' });
  const teacher2 = await Teacher.create({ name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password' });

  // Create some courses
  const course1 = await Course.create({ name: 'Math 101', description: 'Basic Mathematics', teacher_id: teacher1.id });
  const course2 = await Course.create({ name: 'Physics 101', description: 'Introduction to Physics', teacher_id: teacher2.id });

  // Create some rooms
  const room1 = await Room.create({ name: 'Room A', capacity: 30 });
  const room2 = await Room.create({ name: 'Room B', capacity: 20 });

  // Create some groups
  const group1 = await Group.create({ name: 'Group 1', course_id: course1.id });
  const group2 = await Group.create({ name: 'Group 2', course_id: course2.id });

  // Create some students
  const student1 = await Student.create({ name: 'Student One', email: 'student1@example.com', password: 'password', group_id: group1.id });
  const student2 = await Student.create({ name: 'Student Two', email: 'student2@example.com', password: 'password', group_id: group2.id });

  // Create some classes
  const class1 = await Class.create({ course_id: course1.id, room_id: room1.id, start_time: new Date(), end_time: new Date(), teacher_id: teacher1.id });
  const class2 = await Class.create({ course_id: course2.id, room_id: room2.id, start_time: new Date(), end_time: new Date(), teacher_id: teacher2.id });

  // Create some attendance records
  await AttendanceRecord.create({ student_id: student1.id, class_id: class1.id, check_in_time: new Date(), status: 'Present' });
  await AttendanceRecord.create({ student_id: student2.id, class_id: class2.id, check_in_time: new Date(), status: 'Absent' });

  console.log('Seeding complete!');
}

seed().catch(error => {
  console.error('Error seeding data:', error);
});
