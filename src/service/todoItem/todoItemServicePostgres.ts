import { Guid } from 'guid-typescript';
import { Client, Pool } from 'pg';
import ToDoItem from '../../model/todoItem';
import todoItemServiceBase from './todoItemServiceBase';

export default class ToDoItemServicePostgres extends todoItemServiceBase {
    private _db:Client;
    
    constructor(db:Client) {
        super();
        this._db = db;
    }
    
    getItem = async (listId:Guid) : Promise<ToDoItem[]> => {
        const query = `SELECT * FROM app."TodoItem" WHERE "ListId" = $1`;
        const values = [listId]

        return (await this._db.query(query, values)).rows;
    }

    getItemById = async (listId:Guid, itemId:Guid) : Promise<ToDoItem> => {
        const query = `SELECT * FROM app."TodoItem" WHERE "Id" = $1 AND "ListId" = $2`;
        const values = [itemId, listId];

        return (await this._db.query(query, values)).rows[0];
    }

    createItem = async (listId:Guid, item:ToDoItem) : Promise<void> => {
        const query = `INSERT INTO app."TodoItem" VALUES($1,$2,$3,$4)`;
        const values = [Guid.create().toString(), item.description, item.checked, listId];

        await this._db.query(query, values);
    }

    updateItemDescription = async (listId:Guid, item:ToDoItem) : Promise<void> => {
        const query = `UPDATE app."TodoItem" SET "Description" = $1 WHERE "Id" = $2 AND "ListId" = $3`;
        const values = [item.description, item.id, listId];
        
        await this._db.query(query, values);
    }

    updateItemStatus = async (listId:Guid, item:ToDoItem) : Promise<void> => {
        const query = `UPDATE app."TodoItem" SET "Checked" = $1 WHERE "Id" = $2 AND "ListId" = $3`;
        const values = [item.checked, item.id, listId];

        await this._db.query(query, values);
    }

    deleteItem = async (listId:Guid, itemId:Guid) : Promise<void> => {
        const query = `DELETE FROM app."TodoItem" WHERE "Id" = $1 AND "ListId" = $2`;
        const values = [itemId, listId];

        await this._db.query(query, values);
    }
}
