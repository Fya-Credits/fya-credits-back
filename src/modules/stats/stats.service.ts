import { db } from '../../config/database';

type UserRole = 'admin' | 'commercial' | 'client';

export const statsService = {
  async getDashboard(userId: string, role: UserRole) {
    if (role === 'admin') {
      return this.getAdminStats();
    }
    if (role === 'commercial') {
      return this.getCommercialStats(userId);
    }
    return this.getClientStats(userId);
  },

  async getAdminStats() {
    const [creditsCount, creditsSum, usersByRole] = await Promise.all([
      db('credits').count('* as count').first(),
      db('credits').sum('credit_amount as total').first(),
      db('users').select('role').count('* as count').groupBy('role'),
    ]);

    const totalCredits = parseInt((creditsCount as any)?.count ?? '0', 10);
    const totalAmount = parseFloat((creditsSum as any)?.total ?? '0');

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const creditsThisMonthResult = await db('credits')
      .where('created_at', '>=', thisMonth.toISOString())
      .count('* as count')
      .first();

    const roleCounts = (usersByRole as any[]).reduce(
      (acc, r) => ({ ...acc, [r.role]: parseInt(r.count, 10) }),
      { client: 0, commercial: 0, admin: 0 } as Record<string, number>
    );

    return {
      role: 'admin',
      totalCredits,
      totalAmount,
      creditsThisMonth: parseInt((creditsThisMonthResult as any)?.count ?? '0', 10),
      users: {
        clients: roleCounts.client ?? 0,
        commercials: roleCounts.commercial ?? 0,
        admins: roleCounts.admin ?? 0,
      },
    };
  },

  async getCommercialStats(userId: string) {
    const baseQb = db('credits').where('registered_by', userId);

    const [creditsCount, creditsSum, creditsThisMonthResult] = await Promise.all([
      baseQb.clone().count('* as count').first(),
      baseQb.clone().sum('credit_amount as total').first(),
      (() => {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        return baseQb.clone().where('created_at', '>=', thisMonth.toISOString()).count('* as count').first();
      })(),
    ]);

    const clientRows = await db('credits').where('registered_by', userId).distinct('client_id');
    const uniqueClients = Array.isArray(clientRows) ? clientRows.length : 0;

    return {
      role: 'commercial',
      totalCredits: parseInt((creditsCount as any)?.count ?? '0', 10),
      totalAmount: parseFloat((creditsSum as any)?.total ?? '0'),
      creditsThisMonth: parseInt((creditsThisMonthResult as any)?.count ?? '0', 10),
      uniqueClients,
    };
  },

  async getClientStats(userId: string) {
    const baseQb = db('credits').where('client_id', userId);

    const [creditsCount, creditsSum] = await Promise.all([
      baseQb.clone().count('* as count').first(),
      baseQb.clone().sum('credit_amount as total').first(),
    ]);

    return {
      role: 'client',
      totalCredits: parseInt((creditsCount as any)?.count ?? '0', 10),
      totalAmount: parseFloat((creditsSum as any)?.total ?? '0'),
    };
  },
};
