import ToDoItem from '../model/todoItem';
import { Guid } from 'guid-typescript';
import TodoItemServiceBase from '../service/todoItem/todoItemServiceBase';
import { DbDialect } from '../db';
import ToDoItemServicePostgres from '../service/todoItem/todoItemServicePostgres';
import ToDoItemServiceMongo from '../service/todoItem/todoItemServiceMongo';

let service : TodoItemServiceBase;

export default class ToDoItemController {
    constructor(conn:any) {
        switch (conn.dialect) {
            case DbDialect.Mongo:
                service = new ToDoItemServiceMongo(conn.db);
                break;
        
            default:
                service = new ToDoItemServicePostgres(conn.db);
                break;
        }
    }
}

const crud = {
    getItem : async (req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId;
            const todoItem:ToDoItem[] = await service.getItem(listId);
            console.log(`in getList ${JSON.stringify(todoItem)}`);
            res.status(200).send(todoItem);
        } catch (e) {
            res.status(404).send(e.message);
        }
    },

    getItemById : async (req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId;
            const itemId:Guid = req.params.itemId;
            const todoItem:ToDoItem | null = await service.getItemById(listId, itemId);
            console.log(`in getListById ${JSON.stringify(todoItem)}`);
            res.status(200).send(todoItem);
        } catch (e) {
            res.status(404).send(e.message);
        }
    },

    createItem : async(req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId;
            const item: ToDoItem = req.body;

            await service.createItem(listId, item);
            res.status(201).send({
                message: `Successfully added to list ${listId}`,
            });
        } catch (e) {
            res.status(404).send(e.message);
        }
    },

    updateItemDescription : async(req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId
            const item:ToDoItem = req.body;
            await service.updateItemDescription(listId, item);
            res.status(204).send({
                message: "Successfully updated",
            });
        } catch (e) {
            res.status(404).send(e.message);
        } 
    },

    updateItemStatus : async(req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId
            const item:ToDoItem = req.body;
            await service.updateItemStatus(listId, item);
            res.status(204).send({
                message: "Successfully updated",
            });
        } catch (e) {
            res.status(404).send(e.message);
        } 
    },

    deleteItem : async(req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId;
            const itemId:Guid = req.params.itemId;
            await service.deleteItem(listId, itemId);
            res.status(204).send({
                message: "Successfully deleted",
            });
        } catch (e) {
            res.status(404).send(e.message);
        } 
    },
}

export {crud};