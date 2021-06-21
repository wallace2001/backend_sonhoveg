import { app, server } from './http';

server.listen(process.env.PORT || 3002, () => console.log('Conectado'));
