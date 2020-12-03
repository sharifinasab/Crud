import { Guid } from 'guid-typescript';
import { Db } from 'mongodb';
import ToDoItem from '../../model/todoItem';
import todoItemServiceBase from './todoItemServiceBase';

export default class ToDoItemServiceMongo extends todoItemServiceBase {
    private _db:Db;
    
    constructor(db:Db) {
        super();
        this._db = db;
    }
    
    getItem = async (listId:Guid) : Promise<ToDoItem[]> => {
        return await this._db.collection('TodoList').find({ id: listId }).toArray();
    }

    getItemById = async (listId:Guid, itemId:Guid) : Promise<ToDoItem | null> => {
        return await this._db.collection('TodoList').findOne({ 'items.id': { value: itemId } });
    }

    createItem = async (listId:Guid, item:ToDoItem) : Promise<void> => {
        item.id = Guid.create();
        await this._db.collection('TodoList')
            .findOneAndUpdate({ id: { value: listId } }, { $push: { items: item } });
    }

    updateItemDescription = async (listId:Guid, item:ToDoItem) : Promise<void> => {
        await this._db.collection('TodoList')
            .findOneAndUpdate({ id: { value: listId }, 'items.id': { value: item.id } },
             { $set: { 'items.$.description': item.description } });
    }

    updateItemStatus = async (listId:Guid, item:ToDoItem) : Promise<void> => {
        await this._db.collection('TodoList')
            .findOneAndUpdate({ id: { value: listId }, 'items.id': { value: item.id } },
             { $set: { 'items.$.checked': item.checked } });
    }

    deleteItem = async (listId:Guid, itemId:Guid) : Promise<void> => {
        await this._db.collection('TodoList')
            .findOneAndUpdate({ id: { value: listId } },
                 { $pull: { items: { id: { value: itemId } } } });
    }
}
