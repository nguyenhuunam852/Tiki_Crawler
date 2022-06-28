import { enumProvider } from "src/enum/provider.enum";

export class TikiBooks {
    constructor(init?: object) {
        Object.assign(this, init)
    }
    public id: string;
    public name: string;
    public url_path: string;
    public shortList: string;
    public providers: enumProvider;
}

export class TikiBooksWithStock {
    constructor(init?: object) {
        Object.assign(this, init)
    }
    public id: string;
    public stock: string;
}


export class TikiBooksList {
    constructor(init?: object) {
        Object.assign(this, init)
    }
    public books: TikiBooks[];
}