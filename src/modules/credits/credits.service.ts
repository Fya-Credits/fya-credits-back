import { db } from '../../config/database';
import { addEmailJob } from '../../jobs/emailJob';
import { AppError } from '../../middleware/errorHandler';
import { CreateCreditInput, GetCreditsQuery } from './credits.schema';

export const creditsService = {
  async create(data: CreateCreditInput, commercialId: string) {
    console.log('[Credits:Create] Creating credit', { clientId: data.client_id, commercialId });

    const [credit] = await db('credits')
      .insert({
        client_id: data.client_id,
        credit_amount: data.credit_amount,
        interest_rate: data.interest_rate,
        term_months: data.term_months,
        registered_by: commercialId,
      })
      .returning('*');

    const [client, commercial] = await Promise.all([
      db('users').where({ id: data.client_id }).select('name', 'document').first(),
      db('users').where({ id: commercialId }).select('name').first(),
    ]);

    console.log('[Credits:Create] Credit created successfully', { creditId: credit.id });

    try {
      console.log('[Credits:Create] Sending email notification', { creditId: credit.id });
      await addEmailJob({
        clientName: client?.name ?? '',
        creditAmount: parseFloat(credit.credit_amount),
        commercialName: commercial?.name ?? '',
        registrationDate: new Date(credit.created_at).toLocaleString('es-CO'),
      });
    } catch (error) {
      console.error('[Credits:Create] Error sending email notification', error);
    }

    return this.findById(credit.id);
  },

  async findById(id: string) {
    console.log('[Credits:FindById] Fetching credit', { id });

    const credit = await db('credits')
      .select(
        'credits.*',
        'client.name as client_name',
        'client.document as client_document',
        'commercial.name as commercial_name',
        'commercial.email as commercial_email'
      )
      .leftJoin('users as client', 'credits.client_id', 'client.id')
      .leftJoin('users as commercial', 'credits.registered_by', 'commercial.id')
      .where('credits.id', id)
      .first();

    if (!credit) {
      const error: AppError = new Error('Credit not found');
      error.statusCode = 404;
      throw error;
    }

    return credit;
  },

  async findAll(query: GetCreditsQuery, userId?: string, userRole?: string) {
    console.log('[Credits:FindAll] Fetching credits', { query, userRole });

    const applyFilters = (qb: any) => {
      if (userRole === 'commercial' && userId) {
        qb.where('credits.registered_by', userId);
      }
      if (userRole === 'client' && userId) {
        qb.where('credits.client_id', userId);
      }
      if (query.client_name) {
        qb.whereILike('client.name', `%${query.client_name}%`);
      }
      if (query.client_document) {
        qb.whereILike('client.document', `%${query.client_document}%`);
      }
      if (query.commercial_name) {
        qb.whereILike('commercial.name', `%${query.commercial_name}%`);
      }
      return qb;
    };

    const sortBy = query.sort_by || 'created_at';
    const sortOrder = query.sort_order || 'desc';
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const baseQuery = db('credits')
      .select(
        'credits.*',
        'client.name as client_name',
        'client.document as client_document',
        'commercial.name as commercial_name',
        'commercial.email as commercial_email'
      )
      .leftJoin('users as client', 'credits.client_id', 'client.id')
      .leftJoin('users as commercial', 'credits.registered_by', 'commercial.id');

    const dataQuery = applyFilters(baseQuery.clone())
      .orderBy(`credits.${sortBy}`, sortOrder)
      .limit(limit)
      .offset(offset);

    const countQuery = applyFilters(
      db('credits')
        .leftJoin('users as client', 'credits.client_id', 'client.id')
        .leftJoin('users as commercial', 'credits.registered_by', 'commercial.id')
        .count('credits.id as count')
    ).first();

    const [credits, countResult] = await Promise.all([dataQuery, countQuery]);
    const totalCount = parseInt((countResult as any)?.count ?? '0', 10);

    console.log('[Credits:FindAll] Credits fetched successfully', { count: credits.length, totalCount });

    return {
      credits,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },
};
