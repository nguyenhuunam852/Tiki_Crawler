import { TikiBooks } from "src/dto/book";

export class ConvertJSON {
    static convertTikiBooktoDto(data) {
        let newData = {
            id: data.id,
            name: data.name
        }
        return new TikiBooks(newData);
    }

}