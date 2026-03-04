import sgMail from '@sendgrid/mail';
import { env } from '../config/env';

export interface EmailData {
  clientName: string;
  creditAmount: number;
  commercialName: string;
  registrationDate: string;
}

export const sendCreditEmail = async (data: EmailData): Promise<void> => {
  if (!env.sendgrid.apiKey) {
    console.warn('[Email:Send] SENDGRID_API_KEY not configured, skipping email');
    return;
  }

  console.log('[Email:Send] Sending credit notification email', { clientName: data.clientName });

  sgMail.setApiKey(env.sendgrid.apiKey);

  const msg = {
    to: env.sendgrid.to,
    from: env.sendgrid.from,
    subject: 'Nuevo Crédito Registrado',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="background-color: #052224; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Nuevo Crédito Registrado</h1>
        </div>
        <div style="padding: 32px; background-color: #f8fafc;">
          <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border-left: 4px solid #00D280; margin-bottom: 24px;">
            <p style="margin: 0 0 12px 0; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Detalles del Cliente</p>
            <p style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;"><strong>${data.clientName}</strong></p>
            <p style="margin: 0; color: #00D280; font-size: 24px; font-weight: bold;">$${data.creditAmount.toLocaleString('es-CO')}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div style="flex: 1; min-width: 200px; background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Comercial Asignado</p>
              <p style="margin: 0; color: #334155; font-size: 16px; font-weight: 500;">${data.commercialName}</p>
            </div>
            
            <div style="flex: 1; min-width: 200px; background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Fecha de Registro</p>
              <p style="margin: 0; color: #334155; font-size: 16px; font-weight: 500;">${data.registrationDate}</p>
            </div>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">Fya Social Capital SAS - Notificación Automática</p>
        </div>
      </div>
    `,
    text: `
      Nuevo Crédito Registrado
      
      Nombre del cliente: ${data.clientName}
      Valor del crédito: $${data.creditAmount.toLocaleString('es-CO')}
      Nombre del comercial: ${data.commercialName}
      Fecha de registro: ${data.registrationDate}
    `,
  };

  try {
    const [response] = await sgMail.send(msg);
    console.log('[Email:Send] Email sent successfully', { clientName: data.clientName, statusCode: response.statusCode });
  } catch (error) {
    console.error('[Email:Send] Error sending email', { error });
    throw error;
  }
};
