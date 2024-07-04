import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@theadityagroup.com",
    pass: "obkjfaokdjenbwcf",
  },
});

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { to, subject, html } = req.body;
      console.log(to);
      console.log(subject);
      console.log(html);
      const resData = await transporter.sendMail(
        {
          from: `Aditya Group <noreply@theadityagroup.com>`,
          to,
          subject,
          html,
        },
        (err, info) => {
          if (err) return res.status(500).json({ error: err });
          console.log(info);
          res.status(200).json({ message: "success" });
        }
      );

      console.log("resData---", resData);
    }
  } catch (error) {
    console.log(error);
  }
}
