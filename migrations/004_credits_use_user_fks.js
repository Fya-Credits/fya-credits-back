exports.up = async function (knex) {
  await knex('credits').del();

  await knex.schema.alterTable('credits', (table) => {
    table.dropColumn('client_name');
    table.dropColumn('client_document');
    table.dropColumn('commercial_name');
  });

  await knex.schema.alterTable('credits', (table) => {
    table.uuid('client_id').references('id').inTable('users').onDelete('RESTRICT').notNullable();
  });
  await knex.schema.alterTable('credits', (table) => {
    table.index('client_id');
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('credits', (table) => {
    table.dropIndex('client_id');
    table.dropColumn('client_id');
  });
  await knex.schema.alterTable('credits', (table) => {
    table.string('client_name');
    table.string('client_document');
    table.string('commercial_name');
  });
};
