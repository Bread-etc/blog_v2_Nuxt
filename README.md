利用Nuxt重构博客前后端项目[hastur23.top]

- 添加 PrimeVue 和 tailwindcss
- 添加字体 ~~LXGW WenKai webfont~~,Pingfang SC
- 添加路由缓存`keepalive`

### update

- 添加`vueuse`
- 添加深色浅色模式切换
- 分离`tailwindcss.config.ts`配置文件
- 更新`primevue`版本
- 添加全局颜色变量
- 利用`$fetch`封装拦截器interceptor
- 添加`lodash`
- 引入`utteranc`评论功能
- 添加`styleLint`配置
- 添加`error.vue`错误页

### 数据库设计

<details>
  <summary>数据库设计</summary>

  #### 用户表 (user)
    | 列名         | 类型      | 主键             |
    | ------------ | --------- | ---------------- |
    | id           | serial    | 主键             |
    | user_name    | varchar   | 用户名           |
    | password     | varchar   | 密码             |
    | role         | varchar   | 角色             |
    | nick_name    | varchar   | 昵称             |
    | created_time | timestamp | 默认值为当前时间 |

  #### 文章表 (post)
    | 列名         | 类型      | 主键                        |
    | ------------ | --------- | --------------------------- |
    | id           | serial    | 主键                        |
    | title        | varchar   | 文章标题                    |
    | content      | varchar   | 文章内容                    |
    | author_id    | varchar   | 外键,关联 `user` 表的`id`   |
    | created_time | timestamp | 默认值为当前时间            |
    | updated_time | timestamp | 自动更新为当前时间          |

  #### 文章文件表 (post_file)
    | 列名         | 类型    | 备注                    |
    | ------------ | ------- | ----------------------- |
    | id           | serial  | 主键                    |
    | post_id      | int     | 外键,关联`post`表的`id` |
    | file_name    | varchar | 文件名                  |
    | file_address | varchar | 文件路径                |

  #### 分类/标签表 (category)
    | 列名  | 类型    | 备注          |
    | ----- | ------- | ------------- |
    | id    | serial  | 主键          |
    | name  | varchar | 分类/标签名称 |
    | color | varchar | 颜色(可选)    |
    | icon  | varchar | 图标(可选)    |

  #### 文章标签关联表 (post_category)
  | 列名        | 类型 | 主键     | 备注                      |
  | ----------- | ---- | -------- | ------------------------- |
  | post_id     | INT  | 复合主键 | 关联 `Post` 表的 `id`     |
  | category_id | INT  | 复合主键 | 关联 `Category` 表的 `id` |

</details>

## 后台设计

- 采用原生`nitro` + `prisma`
- 采用~~`MySQL`~~,`postgresql`
- 添加`jsonwebtoken`鉴权
- 添加`PostCategory`关联表,形成多对多关系
- 完成`category`增删改查接口