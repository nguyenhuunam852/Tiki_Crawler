export class TikiBooks {
    constructor(init?: object) {
        Object.assign(this, init)
    }
    public id: string;
    public name: string;
    public url_path: string;
    public shortList: string;
}