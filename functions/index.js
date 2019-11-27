const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const usersDb = db.collection("users");
const reservationsDb = db.collection("reservations");
const playersDb = db.collection("players");

async function restartBrightSign(id, ip) {
  const digestRequest = require("request-digest")(
    "admin",
    functions.config().brightsign.dwspassword
  );
  digestRequest
    .requestAsync({
      host: `http://${ip}`,
      path: "/action.html?reboot=Reboot",
      port: 80,
      method: "GET"
    })
    .then(res => console.log(`Restarted ${id}@${ip} (brightsign)`))
    .catch(err => console.error(`Failed to restart ${id}@${ip} (brightsign)`));
}

exports.logDbWrites = functions.firestore
  .document("reservations/{resId}")
  .onWrite(async (change, context) => {
    const data = change.after.data();

    if (!data) {
      console.log(`Deleted reservation for ${change.before.data().for}`);
      return true;
    }

    const doc = await usersDb.doc(data.createdBy).get();
    console.log(
      `${doc.data().name} created reservation with text: ${data.for}`
    );
    return true;
  });

exports.initializePlayer = functions.https.onCall(async (data, context) => {
  const ip = context.rawRequest.ip;
  const deviceType = context.rawRequest.headers["user-agent"].includes(
    "BrightSign"
  )
    ? "brightsign"
    : "rpi";

  // write to db
  playersDb
    .doc(data.player_id)
    .update({
      hardware: deviceType,
      ip: ip
    })
    .then(() =>
      console.log(
        `Signage player ${data.player_id} connected at ${ip}\nType: ${deviceType}`
      )
    );
});

exports.createUser = functions.https.onCall(async (data, context) => {
  function sendEmail(name, email) {
    const nodemailer = require("nodemailer");

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "digitalsignage@uah.edu",
        pass: functions.config().smtp.password
      }
    });

    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 480px !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ffffff;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff"> <tr> <td valign="top" bgcolor="#ffffff" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p>A new user needs your approval to start using Telepark</p></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:18px 18px 18px 18px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div>Please review the following account request from Telepark:</div><div>&nbsp;</div><div>Name: <strong>${name}</strong></div><div>Email: <strong>${email}</strong></div><div>&nbsp;</div><div>This user has been successfully authenticated through the Google UAH G Suite domain.</div></td></tr></table> <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor=""> <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="2px" style="line-height:2px; font-size:2px;"> <tr> <td style="padding: 0px 0px 2px 0px;" bgcolor="#0077C8"></td></tr></table> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:18px 18px 18px 18px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div style="text-align: center;"><strong>Visit your Telepark dashboard</strong> to approve this user. Otherwise, you can ignore this email.</div></td></tr></table> <table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" class="outer-td" style="padding:0px 0px 0px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#39ab39" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit"><a style="background-color:#39ab39;border:1px solid #333333;border-color:#333333;border-radius:3px;border-width:0px;color:#ffffff;display:inline-block;font-family:helvetica,arial,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none" href="https://uahparking.web.app" target="_blank">Visit Dashboard</a></td></tr></tbody></table></td></tr></tbody></table> <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""> </td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:50% !important;width:50%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/382f4c666b89e2b4618eafa7250ae1da533f16da95627fc1ff7b5bd7c27a5ef1fc2f03d0af57aa3e7e3f5d2f1b3d038266a1ecb64a09259caf8f44ab525bd446.png" alt="UAH Logo" width="300"> </td></tr></table> <div data-role="module-unsubscribe" class="module unsubscribe-css__unsubscribe___2CDlR" role="module" data-type="unsubscribe" style="color:#444444;font-size:12px;line-height:20px;padding:16px 16px 16px 16px;text-align:center"><div class="Unsubscribe--addressLine"><p class="Unsubscribe--senderName" style="font-family:Arial,Helvetica, sans-serif;font-size:12px;line-height:20px">UAH Telepark</p><p style="font-family:Arial,Helvetica, sans-serif;font-size:12px;line-height:20px"><span class="Unsubscribe--senderAddress">301 Sparkman Drive</span>, <span class="Unsubscribe--senderCity">Huntsville</span>, <span class="Unsubscribe--senderState">AL</span> <span class="Unsubscribe--senderZip">35899</span> </p></div><p style="font-family:Arial,Helvetica, sans-serif;font-size:12px;line-height:20px"><a class="Unsubscribe--unsubscribeLink" href="<%asm_group_unsubscribe_raw_url%>">Unsubscribe</a> - <a class="Unsubscribe--unsubscribePreferences" href="<%asm_preferences_raw_url%>">Unsubscribe Preferences</a></p></div></td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body></html>`;

    transporter
      .sendMail({
        from: "digitalsignage@uah.edu",
        to: "hohosanta@me.com",
        subject: "New User - Telepark",
        html: html
      })
      .then(info => {
        console.log("New user email sent");
      })
      .catch(e => console.error(e));
  }

  const { auth } = context;
  const userDoc = usersDb.doc(auth.uid);
  const snap = await userDoc.get();
  if (snap.exists) return false;

  userDoc
    .set({
      name: auth.token.name,
      email: auth.token.email,
      isActiveEmployee: false,
      isAdmin: false
    })
    .then(result => {
      console.log(`created user ${auth.token.name}`);
      sendEmail(auth.token.name, auth.token.email);
      return true;
    })
    .catch(error => {
      console.log(`failed to create user ${auth.uid}`);
      console.error(error);
      return false;
    });
});

exports.restartDevices = functions.https.onCall(async (data, context) => {
  const { auth } = context;
  // eventually, check if current employee

  // determine what kind of device each player is (from db)
  const snap = await playersDb.get();
  const players = snap.docs;

  let raspberryPisToRestart = [];

  for (player_id in data) {
    player = players.find(player => player.id === data[player_id]);

    const { hardware, ip } = player.data();
    if (hardware === "brightsign") restartBrightSign(player.id, ip);
    else raspberryPisToRestart.push(player.id);
  }

  // if rpi devices need restarted
  if (raspberryPisToRestart.length) {
    const { PubSub } = require("@google-cloud/pubsub");
    const pubsub = new PubSub();

    const dataBuffer = Buffer.from(JSON.stringify(raspberryPisToRestart));
    const msgId = await pubsub.topic("restart").publish(dataBuffer);

    console.log(`Restarting ${raspberryPisToRestart} (rpi)`);
    console.log(`Message ${msgId} published.`);
  }
});

exports.cleanOldReservations = functions.pubsub
  .schedule("00 18 * * *")
  .timeZone("America/Chicago")
  .onRun(async context => {
    let batch = db.batch();
    reservationsDb
      .where("to", "<=", new Date())
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => batch.delete(doc.ref));
        batch
          .commit()
          .then(() => console.log(`deleted ${snapshot.docs.length} documents`))
          .catch(e => console.error(e));
      })
      .catch(e => console.error(e));
  });
