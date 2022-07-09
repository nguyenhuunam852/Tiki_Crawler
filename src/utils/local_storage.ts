let fs = require('fs');


export class Local_Storage_Management {
    public data = {};
    constructor() {
        this.data = {
            user_account: JSON.parse(fs.readFileSync('./src/local/user_account.json')),
            account: JSON.parse(fs.readFileSync('./src/local/account.json')),
            monitoring: JSON.parse(fs.readFileSync('./src/local/monitoring.json')),
        }
    }

    updateData(data_field, check_field, data, context, exist) {
        try {
            if (exist) {
                if (typeof data == "object") {
                    let list_property = Object.keys(data);
                    let get_data = context.getOne(data_field, check_field, data);
                    for (var property of list_property) {
                        get_data[property] = data[property]
                    }
                    return get_data;
                }
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

    insertData(data_field, data, context, exist) {
        try {
            if (!exist) {
                if (typeof data == "object") {
                    if (Array.isArray(data)) {
                        data.forEach(item => {
                            item.id = + new Date();
                            context.data[data_field].push(item)
                        })
                    }
                    else {
                        // console.log(data)
                        console.log("ADD NEW DATA");
                        data.id = + new Date();
                        context.data[data_field].push(data)
                    }
                }
                return data;
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

    saveFile(data_field) {
        try {
            fs.writeFileSync(`./src/local/${data_field}.json`, JSON.stringify(this.data[data_field]));
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    getListByCondition(data_field, check_field, data) {
        let condition_key = check_field;

        const check_by_property = (filter_data, property) => {
            return filter_data.filter(item => item[property] == data[property])
        }

        var filter_data = this.data[data_field];

        for (var property of condition_key) {
            filter_data = check_by_property(filter_data, property);
            if (!filter_data.length) {
                filter_data = [];
                break;
            }
        }
        return filter_data;
    }

    checkExisted(data_field, check_field, data, callback) {
        try {
            let filter_data = []
            filter_data = this.getListByCondition(data_field, check_field, data);
            return callback(data_field, data, this, filter_data.length);
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

    getOne(data_field, check_field, data) {
        try {
            let filter_data = []
            filter_data = this.getListByCondition(data_field, check_field, data);
            if (filter_data.length) {
                return filter_data[0];
            }
            else {
                return null;
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }

}
