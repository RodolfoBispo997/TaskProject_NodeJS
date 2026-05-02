const nodemailer = require("nodemailer");

async function test() {
  console.log("Tentando conectar...");

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    auth: {
      user: "SEU_USER",
      pass: "SEU_PASS",
    },
  });

  await transporter.verify();

  console.log("Conectou!");

  await transporter.sendMail({
    from: "test@test.com",
    to: "test@test.com",
    subject: "Teste",
    text: "OK",
  });

  console.log("Email enviado!");
}

test().catch(console.error);
