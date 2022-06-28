import { Inject, Injectable } from "@nestjs/common";
import DatabaseConfig from "src/config/database";
import { Connection, DataSource, DataSourceOptions, getConnection, QueryRunner } from "typeorm";

@Injectable()
export class DatabaseManager {
    constructor(
        @Inject('DATA_SOURCE')
        private dataSource: DataSource,
    ) {
    }
    async saveEntities<T>(args: new () => T, object) {
        if (typeof object == "object") {
            const repo = this.dataSource.getRepository(args);
            let result = await repo.save(object);
            return result;
        }
    }

    async query(command) {
        if (command) {
            let result = await this.dataSource.query(command);
            return result;
        }
    }

    getMaxByType(types) {
        return `select * from books having id in (select Max(id) from books where providers = '${types}')`
    }

}