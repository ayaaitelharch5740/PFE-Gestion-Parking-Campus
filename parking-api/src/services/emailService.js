const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aitelharchaya12@gmail.com',      
    pass: 'qbms jmhh iepa rjiz',      
  }
})

const sendReservationConfirmation = async ({ to, userName, slotCode, zone, plateNumber, startTime, endTime }) => {
  const fmt = dt => new Date(dt).toLocaleString('fr-MA', {
    dateStyle: 'long',
    timeStyle: 'short'
  })

  const duration = Math.round((new Date(endTime) - new Date(startTime)) / 3600000 * 10) / 10

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f4f6f9; padding: 20px; border-radius: 12px;">
      
      <div style="background: #2563eb; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🅿 ParkCampus</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Confirmation de réservation</p>
      </div>

      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
        <p style="color: #1a2332; font-size: 16px;">Bonjour <strong>${userName}</strong>,</p>
        <p style="color: #6b7280;">Votre réservation a été confirmée avec succès ✅</p>
      </div>

      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
        <h2 style="color: #1a2332; font-size: 18px; margin-top: 0;">📋 Détails de la réservation</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e8ecf2;">
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Place</td>
            <td style="padding: 12px 0; color: #1a2332; font-weight: 700; font-size: 14px;">${slotCode}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e8ecf2;">
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Zone</td>
            <td style="padding: 12px 0; color: #1a2332; font-weight: 700; font-size: 14px;">Zone ${zone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e8ecf2;">
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Véhicule</td>
            <td style="padding: 12px 0; color: #2563eb; font-weight: 700; font-size: 14px;">${plateNumber}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e8ecf2;">
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Début</td>
            <td style="padding: 12px 0; color: #1a2332; font-weight: 700; font-size: 14px;">🕐 ${fmt(startTime)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e8ecf2;">
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Fin</td>
            <td style="padding: 12px 0; color: #1a2332; font-weight: 700; font-size: 14px;">🕔 ${fmt(endTime)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Durée</td>
            <td style="padding: 12px 0; color: #16a34a; font-weight: 700; font-size: 14px;">⏱ ${duration} heure(s)</td>
          </tr>
        </table>
      </div>

      <div style="background: #dcfce7; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #16a34a;">
        <p style="color: #16a34a; margin: 0; font-size: 13px; font-weight: 600;">
          ✅ Présentez-vous à l'heure indiquée. Bonne journée !
        </p>
      </div>

      <p style="color: #a0aab8; font-size: 12px; text-align: center;">
        ParkCampus — Système de gestion du parking universitaire
      </p>
    </div>
  `

  await transporter.sendMail({
    from: '"ParkCampus 🅿" <TON_EMAIL@gmail.com>',
    to,
    subject: `✅ Réservation confirmée — Place ${slotCode} Zone ${zone}`,
    html,
  })
}

module.exports = { sendReservationConfirmation }