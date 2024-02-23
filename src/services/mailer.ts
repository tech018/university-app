import nodemailer from "nodemailer";
import { google } from "googleapis";
import appConfig from "../config";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
  const oAuth2Client = new google.auth.OAuth2(
    appConfig.google.clientId,
    appConfig.google.secret,
    appConfig.google.redirectUri
  );

  oAuth2Client.setCredentials({ refresh_token: appConfig.google.refresToken });
  const accessToken = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: appConfig.google.service,
    auth: {
      type: appConfig.google.type,
      user: appConfig.google.sender,
      clientId: appConfig.google.clientId,
      clientSecret: appConfig.google.secret,
      refreshToken: appConfig.google.refresToken,
      accessToken: `${accessToken}`,
    },
  });

  await transport.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log("Failed email transport");
    } else {
      return console.log("Success email transferred");
    }
  });
};

export default {
  sendEmail,
};
