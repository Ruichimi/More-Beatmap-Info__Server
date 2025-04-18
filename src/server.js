const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('module-alias/register');

const app = express();

const port = 3000;
const routes = require('./routes');
const { commandsRunning } = require('./commands/ServerRunningCommandsInterface');
const OsuApi = require('./services/OsuApi/OsuApiHelper');


app.use(express.json({ limit: '320kb' }));

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: "Authorization, Content-Type, x-client-id, x-retry-request"
};

app.use(cors(corsOptions));
app.use(routes);

app.listen(port, async () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

const fileCacheCommands = {
    "size-bs": async () => console.log('Размер долгого кеша (beatmapset):',
        await OsuApi.getCacheSize('beatmapset')),

    "size-bm": async () => console.log('Размер долгого кеша (beatmapset):',
        await OsuApi.getCacheSize('beatmap')),

    "bs": (id) => OsuApi.getObjectByIdFromDB(id, 'beatmapset'),

    "bm": (id) =>  OsuApi.getObjectByIdFromDB(id, 'beatmap'),
};

const functionCommands = {
    "clean-archive-bs": () => OsuApi.cleanObjectArchive('beatmapset'),
    "clean-archive-bm": () => OsuApi.cleanObjectArchive('beatmap'),

    "clean-bs": (amount) => OsuApi.cleanItemsAmount('beatmapset', amount),
    "clean-bm": (amount) => OsuApi.cleanItemsAmount('beatmap', amount),

    "fake-bs": (amount) => OsuApi.createFakeEntries('beatmapset', amount),
    "fake-bm": (amount) => OsuApi.createFakeEntries('beatmap', amount),
}

commandsRunning({
    ...fileCacheCommands,
    ...functionCommands
});
