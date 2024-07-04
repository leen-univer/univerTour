const MailStyle = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}
body {
  background: #fafafa;
}
.img-logo {
  width: 180px;
  margin: auto;
}
.tbl-bordered {
  border: 1px solid #ddd;
  width: 800px;
  margin: 20px auto;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
}
tr {
  border: 1px solid #ddd;
}
th {
  display: block;
}
th,
h3 {
  padding: 10px 0;
}
td {
  padding: 10px;
  line-height: 1.7em;
}
.bg-expo {
  background-image: linear-gradient(to right, #0D70AE , #B1336E);
  color: #fff;
}
.link {
  text-decoration: none;
}
.footer-tr {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.icon-link {
  display: inline-flex;
  align-items: center;
  gap: 1em;
}
.icon-margin-right {
  margin-right: 10px;
}
.social-icon {
  margin: 0.5em 0.2em !important;
  cursor: pointer !important;
}
a {
  text-decoration: none;
}
@media only screen and (max-width: 600px) {
  table {
    width: 100% !important;
  }
  tr td {
    width: 100% !important;
    display: block !important;
  }
}
`;

const MailHeader = `
<tr>
  <td class="bg-expo" colspan="100%" align="center">The Aditya Group</td>
</tr>
`;

const MailFooter = `
<tr class="footer-tr">
  <td align="left" class="icon-link" colspan="100%">
    
    <a href="mailto: mailto:care@theadityagroup.com" style="font-size: mailto:12px">care@theadityagroup.com</a>
  </td>
  <td align="right" class="icon-link" colspan="100%">
      
      <a href="https://www.theadityagroup.com/" target="_blank" style="font-size: 12px">The Aditya Group</a>
  </td>
</tr>
`;

export const normalMailBody = (content, name) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <style>${MailStyle}</style>
  </head>
  <body>
    <table class="tbl-bordered">
      ${MailHeader}
      <tr>
        <td colspan="100%">
          <h3>Dear ${name.charAt(0).toUpperCase() + name.slice(1)},</h3>
          <p>
            ${content}
          </p>
          <br />
          <b>
            <p>Thanks & Regards</p>
            <p>The Aditya Group</p>
          </b>
        </td>
      </tr>
      ${MailFooter}
    </table>
  </body>
</html>
`;
export const adminMailBody = (content, name) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <style>${MailStyle}</style>
  </head>
  <body>
    <table class="tbl-bordered">
      ${MailHeader}
      <tr>
        <td colspan="100%">
          <h3>Dear Admin,</h3>
          <p>
            ${content}
          </p>
          <br />
          <b>
            <p>Thanks</p>
          </b>
        </td>
      </tr>
      ${MailFooter}
    </table>
  </body>
</html>
`;
