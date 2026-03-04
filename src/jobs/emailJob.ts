import Queue from 'bull';
import { env } from '../config/env';
import { sendCreditEmail, EmailData } from '../utils/mailer';

let emailQueue: Queue.Queue | null = null;
let useQueue = true;

try {
  emailQueue = new Queue('email', {
    redis: {
      host: env.redis.host,
      port: env.redis.port,
    },
  });

  emailQueue.process(async (job) => {
    console.log('[EmailJob:Process] Processing email job', { jobId: job.id });
    const data = job.data as EmailData;
    await sendCreditEmail(data);
    console.log('[EmailJob:Process] Email job completed', { jobId: job.id });
  });

  emailQueue.on('error', () => {
    if (useQueue) {
      console.warn('[EmailJob] Redis not available, using setImmediate fallback for emails');
      useQueue = false;
    }
  });
} catch (error) {
  console.warn('[EmailJob:Init] Redis not available, using setImmediate fallback', error);
  useQueue = false;
}

export const addEmailJob = async (data: EmailData): Promise<void> => {
  if (useQueue && emailQueue) {
    try {
      console.log('[EmailJob:Add] Adding email job to queue', { clientName: data.clientName });
      await emailQueue.add(data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });
      return;
    } catch (error) {
      console.warn('[EmailJob:Add] Queue error, sending email directly', error);
      useQueue = false;
    }
  }

  console.log('[EmailJob:Add] Sending email directly', { clientName: data.clientName });
  try {
    await sendCreditEmail(data);
    console.log('[EmailJob:Add] Email sent successfully', { clientName: data.clientName });
  } catch (error) {
    console.error('[EmailJob:Add] Error sending email', error);
    throw error;
  }
};

export default emailQueue;
