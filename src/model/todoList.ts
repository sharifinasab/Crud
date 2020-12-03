import { Guid } from "guid-typescript"

interface IToDoList {
    id: Guid;
    name: string;
}

export default class ToDoList implements IToDoList {
    id: Guid = Guid.createEmpty();
    private _name!: string;
    
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if(value.length > 96) {
            throw Error("List name length is too long !");
        }

        if(value.length == 0) {
            throw Error("List name can not be empty !");
        }

        this._name = value;

    }
}