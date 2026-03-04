exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('role').defaultTo('client');
    table.string('document');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role');
    table.dropColumn('document');
  });
};
