import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer"

export default function sendGmail(req: NextApiRequest, res: NextApiResponse) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.GMAILUSER,
          pass: process.env.GMAILPASSWORD,
        },
    });

    const toHostMailData = {
        from: `${req.body.email}`,
        to: "h.kaneko1199@gmail.com",
        subject: `[お問い合わせ] ${req.body.name}様より`, 
        text: `${req.body.message} Send from ${req.body.email}`, 
        html: `
            <p>【名前】</p>
            <p>${req.body.name}</p>
            <p>【メッセージ内容】</p>
            <p>${req.body.message}</p>
            <p>【メールアドレス】</p>
            <p>${req.body.email}</p>
        `, 
    }

    const toSenderMailData = {
        to: req.body.email,
        from: 'h.kaneko1199@gmail.com',
        subject: 'お問合せありがとうございました。',
        text: `お問合せを受け付けました。回答をお待ちください。 + ${req.body.message}`,
        html: `
          <p>${req.body.name}様</p>
          <p>お問合せを受け付けました。回答をお待ちください。</p><br/>
  
          <p>【問い合わせ内容】</p>
          <p>${req.body.message}</p>
        `,
    }

    function sendMail(mailData) {
        transporter.sendMail(mailData, function (error, info) {
            if (error) {
                console.log(error);
                return res.status(500).send(`メール送信に失敗しました+${mailData}`);
            } else {
                console.log(info);
            }
        });
    }

    sendMail(toHostMailData);
    sendMail(toSenderMailData);
    res.send("メール送信処理を開始しました");
}