import { Guid } from 'guid-typescript';
import { Db } from 'mongodb';
import ToDoList from '../../model/todoList';
import TodoListServiceBase from './todoListServiceBase';

export default class ToDoListServiceMongo extends TodoListServiceBase {
    private _db:Db;
    
    constructor(db:Db) {
        super();
        this._db = db;
    }
    
    getList = async () : Promise<ToDoList[]> => {
        return this._db.collection('TodoList').find().toArray();
    }

    getListById = async (id:Guid) : Promise<ToDoList | null> => {
        return await this._db.collection("TodoList").findOne({id: { value: id } })
    }

    createList = async (list:ToDoList) : Promise<void> => {
        await this._db.collection('TodoList').insertOne(list);
    }

    updateList = async (list:ToDoList) : Promise<void> => {
        await this._db.collection('TodoList').findOneAndUpdate(
                    { id: { value: list.id } },
                    { $set: { name: list.name } },
                    () => { console.log(`List ${list.id} updated.`); });
    }

    deleteList = async (id:Guid) : Promise<void> => {
        await this._db.collection('TodoList').deleteOne({ id: { value: id } }, () =>
        { console.log(`List ${id} deleted.`); }
        );
    }

}