import { Guid } from "guid-typescript";
import ToDoItem from "../../model/todoItem";

export default abstract class TodoItemServiceBase {
    abstract getItem(listId:Guid) : Promise<ToDoItem[]>;
    abstract getItemById(listId:Guid, itemId:Guid) : Promise<ToDoItem | null>;
    abstract createItem(listId:Guid, item:ToDoItem) : Promise<void>;
    abstract updateItemDescription(listId:Guid, item:ToDoItem) : Promise<void>;
    abstract updateItemStatus(listId:Guid, item:ToDoItem) : Promise<void>;
    abstract deleteItem(listId:Guid, itemId:Guid) : Promise<void>;
}