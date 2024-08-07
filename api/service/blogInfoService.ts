import { IBlogInfoMethod } from '../interface/IBlogInfo';
import type { BlogInfo } from '../model/BlogInfo';

const service = new IBlogInfoMethod();

export class blogInfoService {

    public async getList(): Promise<BlogInfo> {
        const res = await service.getBlogInfo();
        return res.data;
    }
}
