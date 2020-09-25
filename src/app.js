require('dotenv').config({ path: `${__dirname}/../.env` })
const cluster = require('cluster')
const numCPUs = require('os').cpus().length;
const app = require('express')()
const consign = require('consign')
const db_postgres = require('./config/db_postgres')

app.db = db_postgres


// carregar rotas
consign({
    cwd: __dirname + '/',
    locale: 'pt-br',
    logger: console,
    verbose: true,
    extensions: [ '.js', '.json', '.node' ],
    loggingType: 'info'
})
    .then('config/middlewares.js')
    .include('controllers')
    .include('routes')
    .into(app);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    app.listen(process.env.PORT, () => console.log(`VILA API RUNNING... PORT--> ${process.env.PORT}`))
}

