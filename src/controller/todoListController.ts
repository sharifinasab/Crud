import ToDoList from '../model/todoList';
import { Guid } from 'guid-typescript';
import TodoListServiceBase from '../service/todoList/todoListServiceBase';
import { DbDialect } from '../db';
import ToDoListServiceMongo from '../service/todoList/todoListServiceMongo';
import ToDoListServicePostgres from '../service/todoList/todoListServicePostgres';

let service : TodoListServiceBase;

export default class ToDoListController {
    constructor(conn:any) {
        switch (conn.dialect) {
            case DbDialect.Mongo:
                service = new ToDoListServiceMongo(conn.db);
                break;
        
            default:
                service = new ToDoListServicePostgres(conn.db);
                break;
        }
    }
}

const crud = {
    getList : async (req:any, res:any) => {
        try {
            const todoList:ToDoList[] = await service.getList();
            console.log(`in getList ${JSON.stringify(todoList)}`);
            res.status(200).send(todoList);
        } catch (e) {
            res.status(404).send(e.message);
        }
    },

    getListById : async (req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId;
            const todoList:ToDoList | null = await service.getListById(listId);

            if(todoList == null) {
                throw "List not found";
            }

            console.log(`in getListById ${JSON.stringify(todoList)}`);
            res.status(200).send(todoList);

        } catch (e) {
            res.status(404).send(e.message);
        }
    },

    createList : async(req:any, res:any) => {
        try {
            let list = new ToDoList();
            list.name = req.body.name;
            list.id = Guid.create();
        
            await service.createList(list);

            res.status(201).send({
                message: "Successfully added",
            });
        } catch (e) {
            res.status(404).send(e.message);
        }
    },

    updateList : async(req:any, res:any) => {
        try {
            let list = new ToDoList();
            list.name = req.body.name;

            await service.updateList(list);

            res.status(200).send({
                message: "Successfully updated",
            });
        } catch (e) {
            res.status(404).send(e.message);
        } 
    },

    deleteList : async(req:any, res:any) => {
        try {
            const listId:Guid = req.params.listId;

            await service.deleteList(listId);

            res.status(200).send({
                message: "Successfully deleted",
            });
        } catch (e) {
            res.status(404).send(e.message);
        } 
    },
}

export {crud};