import { HttpService } from "../../composables/useHttp";
import type { BlogInfo } from '../model/BlogInfo';

const http = new HttpService();

export class IBlogInfoMethod {

    public getBlogInfo() {
        return http.get<BlogInfo>("/getList");
    }
}