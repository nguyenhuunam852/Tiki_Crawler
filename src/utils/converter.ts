import { TikiBooks } from "src/dto/book";

export class ConvertJSON {
    static convertTikiBooktoDto(data) {
        let newData = {
            id: data.id,
            name: data.name,
            url_path: data.url_path,
            providers: data.providers
        }
        return new TikiBooks(newData);
    }

}