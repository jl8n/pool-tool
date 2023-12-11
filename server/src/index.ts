import fastify from 'fastify';
import cors from '@fastify/cors';
import { callPoolApi, findVisibleFeatures } from './njspcApi.js';


const server = fastify();

interface RouteParams {
    section: string;
}



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


server.get<{ Params: RouteParams }>('/config/options/:section', async (req, reply) => {

    try {
        const section = req.params.section; // Get the type from the URL parameter

        console.log(`Getting config/options/${section}`);

        // Await the result of callPoolApi before sending it
        const response = await callPoolApi(`config/options/${section}`, 'GET');
        reply.send(response);

    } catch (error) {
        console.error(`Error getting ${req.params.section} config:`, error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});


interface ConfigParams { section: string; }

server.get<{ Params: ConfigParams }>('/config/:section', async (req, reply) => {
    try {
        const section = req.params.section;

        const response = await callPoolApi(`config/${section}`, 'GET');
        console.log(`Getting config/${section}`);

        reply.send(response);
    } catch (error) {
        console.error(`Error getting ${req.params.section} config:`, error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});



server.get('/state/visible', async (req, reply) => {
    try {
        const response = await callPoolApi(`state/all`, 'GET');
        console.log(`Getting state/visible`);
        let results = findVisibleFeatures(response);

        reply.send(results);
    } catch (error) {
        console.error(`Error getting state/visible: `, error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});


interface StateParams { section: string; }

server.get<{ Params: StateParams }>('/state/:section', async (req, reply) => {
    try {
        const section = req.params.section;

        const response = await callPoolApi(`state/${section}`, 'GET');
        console.log(`Getting state/${section}`);

        reply.send(response);
    } catch (error) {
        console.error(`Error getting state/${req.params.section}: `, error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});


interface CircuitParams {
    id: string;
}

server.get<{ Params: CircuitParams }>('/circuit/:id/status', async (req, reply) => {
    try {
        const circuitId = req.params.id;

        const response = await callPoolApi(`state/circuit/${circuitId}`, 'GET');
        console.log('getting circuit status ', `state/circuit/${circuitId}`);
        reply.send(response);

        if (response && response.name) {
            console.log('Circuit name:', response.name);
        } else {
            console.log('Name not found in response');
        }
    } catch (error) {
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});


interface CircuitStateBody {
    id: number;
    state: string;
}

server.put<{ Body: CircuitStateBody }>('/circuit/setState', async (req, reply) => {
    try {
        const { id, state } = req.body;

        console.log('putting circuit state ', { id, state });
        if (typeof id === 'undefined' || typeof state === 'undefined') {
            return reply.status(400).send({ error: 'Missing id or state in the request body' });
        }

        const response = await callPoolApi('state/circuit/setState', 'PUT', { id, state });
        reply.send(response);
    } catch (error) {
        console.error('Error in setting circuit state:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});


server.setNotFoundHandler((req, reply) => {
    reply.status(404).send({ error: 'Endpoint not found' });
});




server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});