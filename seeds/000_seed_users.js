const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('credits').del();
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'Admin User', email: 'admin@fyacredits.com', password: hashedPassword, role: 'admin', document: null },
    { name: 'Comercial 1', email: 'comercial1@fyacredits.com', password: hashedPassword, role: 'commercial', document: null },
    { name: 'Comercial 2', email: 'comercial2@fyacredits.com', password: hashedPassword, role: 'commercial', document: null },
    { name: 'Comercial 3', email: 'comercial3@fyacredits.com', password: hashedPassword, role: 'commercial', document: null },
    { name: 'Pepito Perez', email: 'pepito@example.com', password: hashedPassword, role: 'client', document: '1234567890' },
    { name: 'Maria Perez', email: 'maria@example.com', password: hashedPassword, role: 'client', document: '2345678901' },
    { name: 'Antonio Rodriguez', email: 'antonio@example.com', password: hashedPassword, role: 'client', document: '3456789012' },
    { name: 'Giselle López', email: 'giselle@example.com', password: hashedPassword, role: 'client', document: '4567890123' },
    { name: 'Martha Perez', email: 'martha@example.com', password: hashedPassword, role: 'client', document: '5678901234' },
    { name: 'Isaac llanos', email: 'isaac@example.com', password: hashedPassword, role: 'client', document: '6789012345' },
    { name: 'Teresa Gutierrez', email: 'teresa@example.com', password: hashedPassword, role: 'client', document: '7890123456' },
    { name: 'Isabel Llanos', email: 'isabel@example.com', password: hashedPassword, role: 'client', document: '8901234567' },
    { name: 'Paola Tao', email: 'paola@example.com', password: hashedPassword, role: 'client', document: '9012345678' },
    { name: 'Wendy Moscoso', email: 'wendy@example.com', password: hashedPassword, role: 'client', document: '0123456789' },
  ];

  await knex('users').insert(users);
};
