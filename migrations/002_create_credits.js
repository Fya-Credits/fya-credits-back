exports.up = async function (knex) {
  await knex.schema.createTable('credits', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('client_name').notNullable();
    table.string('client_document').notNullable();
    table.decimal('credit_amount', 15, 2).notNullable();
    table.decimal('interest_rate', 5, 2).notNullable();
    table.integer('term_months').notNullable();
    table.string('commercial_name').notNullable();
    table.uuid('registered_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamps(true, true);

    table.index('client_name');
    table.index('client_document');
    table.index('commercial_name');
    table.index('created_at');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('credits');
};
