exports.seed = async function (knex) {
  await knex('credits').del();

  const comercial1 = await knex('users').where({ email: 'comercial1@fyacredits.com' }).first();
  const comercial2 = await knex('users').where({ email: 'comercial2@fyacredits.com' }).first();
  const comercial3 = await knex('users').where({ email: 'comercial3@fyacredits.com' }).first();

  const getClient = (doc) => knex('users').where({ document: doc, role: 'client' }).first();

  const credits = [
    { client_id: (await getClient('1234567890')).id, credit_amount: 7800000, interest_rate: 2, term_months: 10, registered_by: comercial1.id },
    { client_id: (await getClient('2345678901')).id, credit_amount: 12500000, interest_rate: 2, term_months: 5, registered_by: comercial2.id },
    { client_id: (await getClient('3456789012')).id, credit_amount: 10312673, interest_rate: 2, term_months: 5, registered_by: comercial1.id },
    { client_id: (await getClient('4567890123')).id, credit_amount: 8628510, interest_rate: 2, term_months: 12, registered_by: comercial3.id },
    { client_id: (await getClient('5678901234')).id, credit_amount: 5889085, interest_rate: 2, term_months: 24, registered_by: comercial2.id },
    { client_id: (await getClient('6789012345')).id, credit_amount: 14793565, interest_rate: 2, term_months: 48, registered_by: comercial1.id },
    { client_id: (await getClient('7890123456')).id, credit_amount: 8072348, interest_rate: 2, term_months: 50, registered_by: comercial3.id },
    { client_id: (await getClient('8901234567')).id, credit_amount: 5143860, interest_rate: 2, term_months: 60, registered_by: comercial2.id },
    { client_id: (await getClient('9012345678')).id, credit_amount: 12881963, interest_rate: 2, term_months: 24, registered_by: comercial1.id },
    { client_id: (await getClient('0123456789')).id, credit_amount: 13484682, interest_rate: 2, term_months: 40, registered_by: comercial3.id },
  ];

  await knex('credits').insert(credits);
};
