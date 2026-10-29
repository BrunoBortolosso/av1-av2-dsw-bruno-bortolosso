require('dotenv/config');
const app = require('./app');

const port = Number(process.env.PORT || 3333);
app.listen(port, () => console.log(`Aula em Dia API rodando em http://localhost:${port}`));
