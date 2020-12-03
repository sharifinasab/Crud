import { Guid } from "guid-typescript"

interface IToDoItem {
    id: Guid;
    description: string;
    checked: boolean;
}

export default class ToDoItem implements IToDoItem {
    id: Guid = Guid.createEmpty();
    checked: boolean = false;
    private _description!: string;

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        if(value.length > 256) {
            throw Error("description length is too large !");
        }
        this._description = value;

    }
}