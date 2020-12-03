import { json } from 'express';
import { Guid } from 'guid-typescript';
import { Client, Pool } from 'pg';
import ToDoList from '../../model/todoList';
import TodoListServiceBase from './todoListServiceBase';

export default class ToDoListServicePostgres extends TodoListServiceBase {
    private _db:Client;
    
    constructor(db:Client) {
        super();
        this._db = db;
    }
    
    getList = async () : Promise<ToDoList[]> => {
        const query = 'SELECT * FROM app."TodoList"';
        return (await this._db.query(query)).rows
    }

    getListById = async (id:Guid) : Promise<ToDoList | null> => {
        const query = `SELECT * FROM app."TodoList" WHERE "Id" = $1`;
        const values = [id];

        return (await this._db.query(query, values)).rows[0];
    }

    createList = async (list:ToDoList) : Promise<void> => {
        const query = `INSERT INTO app."TodoList" VALUES($1, $2)`;
        const values = [Guid.create().toString(), list.name];
        await this._db.query(query, values);
    }

    updateList = async (list:ToDoList) : Promise<void> => {
        const query = `UPDATE app."TodoList" SET "Name" = $1 WHERE "Id" = $2`;
        const values = [list.name, list.id];
        await this._db.query(query, values);
    }

    deleteList = async (id:Guid) : Promise<void> => {
        const query = `DELETE FROM app."TodoList" WHERE "Id" = $1`;
        const values = [id];
        await this._db.query(query, values);
    }

}