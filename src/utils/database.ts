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
    async findOne<T>(args: new () => T, condition) {
        const repo = this.dataSource.getRepository(args);
        return repo.findOne({ where: condition });
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
        return `select book_id,day_ago from books where id =
        (
         select Max(id) as maxid from books a
         group by day_ago
         having day_ago in (select Min(day_ago) from books where providers = '${types}')
        ) `
    }

}