import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { History, HistoryDocument } from './history.schema';

@Injectable()
export class HistoryService {

    constructor(@InjectModel(History.name) private historyModel: Model<History>) { }

    async create(history: History): Promise<HistoryDocument> {
        return this.historyModel.create(history);
    }
}