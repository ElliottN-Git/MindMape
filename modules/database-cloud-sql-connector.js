const { Connection, Request } = require('tedious');
const { Connector } = require('@google-cloud/cloud-sql-connector');

const connector = new Connector();

let clientOpts;
async function getOpts() {
    clientOpts = await connector.getTediousOptions({
        instanceConnectionName: 'neon-reporter-395414:europe-west2:mindmape',//process.env.SQLSERVER_CONNECTION_NAME,
        ipType: 'PUBLIC'
    });
    console.log(clientOpts);
    // return clientOpts;
}

let connection;
getOpts().then(() => {
    connection = new Connection({
        // Please note that the `server` property here is not used and is only defined
        // due to a bug in the tedious driver (ref: https://github.com/tediousjs/tedious/issues/1541)
        // With that in mind, do not try to change this value since it will have no
        // impact in how the connector works, this README will be updated to remove
        // this property declaration as soon as the tedious driver bug is fixed
        server: '0.0.0.0',
        authentication: {
            type: 'default',
            options: {
                userName: 'sqlserver',
                password: 'testingLocalLogin',
            },
        },
        options: {
            ...clientOpts,
            // Please note that the `port` property here is not used and is only defined
            // due to a bug in the tedious driver (ref: https://github.com/tediousjs/tedious/issues/1541)
            // With that in mind, do not try to change this value since it will have no
            // impact in how the connector works, this README will be updated to remove
            // this property declaration as soon as the tedious driver bug is fixed
            port: 9999,
            database: 'mindmapeDB',
        },
    })
    
    
    connection.connect(err => {
        if (err) { throw err; }
        let result;
        const req = new Request('SELECT GETUTCDATE()', (err) => {
            if (err) { throw err; }
        })
        req.on('error', (err) => { throw err; });
        req.on('row', (columns) => { result = columns; });
        req.on('requestCompleted', () => {
            console.table(result);
        });
        connection.execSql(req);
    })
});
// console.log(clientOpts);





// connection.close();
// connector.close();

module.exports = connection;