export interface IModel {
    deepcopy(): any;
    toSave(): any;
    toEdit(): any;
    valid(): boolean;
}