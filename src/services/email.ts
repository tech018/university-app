export default function GenerateEmail({
  message,
}: {
  message: string;
}): string {
  const html = ` <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tarlac Agricultural University</title>
        <style>
        .logo-area {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }
        .tau-logo {
          max-width: 70px;
          max-height: 70px;
        }
        .email-area {
          max-width: 350px;
        }
        .tau-name {
          font-size: 20px;
          line-height: 5px;
        }
        .sub-name {
          line-height: 0px;
        }
        .e-gatepass-area {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .e-gatepass-title {
          font-weight: 800;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 1.5rem;
        }
        .message-area {
          padding: 0px 20px;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 700;
        }
        .e-gatepass-logo {
          max-width: 100px;
          margin-top: 10px;
        }
      </style>
      </head>
      
      <body>
        <div class="email-area">
          <div class="logo-area">
            <img
              class="tau-logo"
              src="https://res.cloudinary.com/shopcamiling/image/upload/v1708434964/logo_jlbsbe.png"
              alt="tau-logo"
            />
            <div>
              <h2 class="tau-name">Tarlac Agricultural University</h2>
              <p class="sub-name">College & university</p>
            </div>
          </div>
          <div class="e-gatepass-area">
            <img
              class="e-gatepass-logo"
              src="https://res.cloudinary.com/shopcamiling/image/upload/v1708434896/gatepass_x7mtuh.png"
              alt="security"
            />
            <h1 class="e-gatepass-title">Electronic Gatepass</h1>
          </div>
          <p class="message-area">
            ${message}
          </p>
        </div>
      </body>
    </html>
    `;

  return html;
}
