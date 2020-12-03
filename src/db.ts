export enum DbDialect {
    Unknown,
    Mongo,
    Postgres,
}

interface connection {
    db: any;
    dialect: DbDialect;
}

let Conn : connection = {} as any;

export async function initDb() {
    if(!process.env.DIALECT) {
        console.error(`Error to get database dialect.`);
        process.exit(1);
    }

    switch (process.env.DIALECT) {

        case 'POSTGRES':
            const { Client } = await import('pg');
            Conn.dialect = DbDialect.Postgres;

            const clnt = new Client({
                host: process.env.HOST,
                port: parseInt(process.env.PORT as string),
                user: process.env.USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
            });

            clnt.connect();
            Conn.db = clnt;

            break;

        case 'MONGODB':
            const { MongoClient } = await import('mongodb');

            Conn.dialect = DbDialect.Mongo;
            let cred:string = "";
            let connStr:string | undefined = process.env.DATABASE_URL; // url for test

            if(connStr === undefined) {
                if(process.env.USER && process.env.PASSWORD) {
                    cred = `${process.env.USER}:${process.env.PASSWORD}@`;
                }
                connStr = `mongodb://${cred}${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`;
            }

            if(connStr) {
                let client = await MongoClient.connect(connStr, 
                    { useNewUrlParser: true, useUnifiedTopology: true });

                    Conn.db = client.db('Todo');
            }

        break;
    
        default:
            console.error("Unknown dialect");
            process.exit(1);
    }
}

export { Conn };