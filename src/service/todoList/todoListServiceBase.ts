import { Guid } from "guid-typescript";
import ToDoList from "../../model/todoList";

export default abstract class TodoListServiceBase {
    abstract getList() : Promise<ToDoList[]>;
    abstract getListById(id:Guid) : Promise<ToDoList | null>;
    abstract createList(list:ToDoList) : Promise<void>;
    abstract updateList(list:ToDoList) : Promise<void>;
    abstract deleteList(id:Guid) : Promise<void>;
}