import fastify from 'fastify';
import cors from '@fastify/cors';

const server = fastify();

// Register CORS
await server.register(cors, {
    origin: '*', // Allow all origins
});

// Endpoints
server.get('/ping', async (request, reply) => {
    reply.send('pong');
});


server.get('/lights', async (request, reply) => {
    reply.send({ lights: 'on' });
});


server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});