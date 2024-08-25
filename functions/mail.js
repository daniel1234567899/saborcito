const nodemailer = require('nodemailer')

const rTemplate = (name, mail, date, time, guests, phone) => {
    return `
    
    <html>
    <head>
      <title>Email de reservacion</title>
    </head>
    <body>
      <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Nombre:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">${name}</td>
        </tr>
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">E-mail:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">${mail}</td>
        </tr>
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Fecha de reservacion:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">${date}</td>
        </tr>
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Hora reservacion:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">${time}</td>
        </tr>
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Numero de invitados:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">${guests}</td>
        </tr>
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Telefono:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">${phone}</td>
        </tr>
      </table>
    </body>
    </html>
    
    `
}

const cTemplate = (name, mail, website, subject, comment) => {
    return `
    
    <html>
        <head>
            <title>Email de contacto</title>
        </head>
        <body>
            <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
            <tr style="height: 32px;">
                <th align="right" style="width:150px; padding-right:5px;">Nombre:</th>
                <td align="left" style="padding-left:5px; line-height: 20px;">${name}</td>
            </tr>
            <tr style="height: 32px;">
                <th align="right" style="width:150px; padding-right:5px;">E-mail:</th>
                <td align="left" style="padding-left:5px; line-height: 20px;">${mail}</td>
            </tr>
            <tr style="height: 32px;">
                <th align="right" style="width:150px; padding-right:5px;">Website:</th>
                <td align="left" style="padding-left:5px; line-height: 20px;">${website}</td>
            </tr>
            <tr style="height: 32px;">
                <th align="right" style="width:150px; padding-right:5px;">Asunto:</th>
                <td align="left" style="padding-left:5px; line-height: 20px;">${subject}</td>
            </tr>
            <tr style="height: 32px;">
                <th align="right" style="width:150px; padding-right:5px;">Comentario:</th>
                <td align="left" style="padding-left:5px; line-height: 20px;">${comment}</td>
            </tr>
            </table>
        </body>
    </html>
    
    `
}


exports.handler = async function(event, context) {

    const transporter = nodemailer.createTransport({
        pool: true,
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.USER_PASS
        }
    })

    const body = JSON.parse(event.body)
    const { name, email, comments, website, subject, type, date, time, guests, phone } = body
    console.log(body)

    const template = type == 'CONTACT' ? cTemplate(name, email, website, subject, comments) : rTemplate(name, email, date, time, guests, phone)
    const _subject = type == 'CONTACT' ? "Nuevo contacto desde pagina web." : "Nueva resevación desde pagina web."
    
    try {
        const verify = await transporter.verify()
        console.log({verify})
        await transporter.sendMail({
            from: 'Attico 303 Website <soporte@zionx.dev>',
            to: "attico303redes@gmail.com",
            subject: _subject,
            html: template
        })
        return {
            statusCode: 200,
            body: JSON.stringify({info: "success"})
        };


    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({info: "error", error, msg: "Mensaje en proceso de envio."})
        };
    }

    
}