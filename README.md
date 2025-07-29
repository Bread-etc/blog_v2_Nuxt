# Nuxt3 重构个人博客

该项目是基于Nuxt3 + Prisma + Tailwindcss + VuePrime + Pinia 构建。
[Bread-etc的个人博客](https://hastur23.top)

## Environment

- NodeJs`20.19.0 LTS`环境
- Nuxt`3.13` + Vue`3.4.21` + Vue-router`4.3.0`
- tailwindcss`3.4.1` + shadcn-vue`1.0.3`

## TodoList

- [x] 重写`login`接口
- [x] 封装`Prisma`实例类`db.ts`
- [x] 重写`responseWrapper`响应函数,验证Token函数
- [x] 封装用户鉴权函数工具`auth.ts`
- [x] 重构数据库表结构`schema.prisma`
- [x] 重写`categories`分类接口,包含CRUD + 获取指定类型下的所有文章
- [x] 重写`posts`文章接口,包含CRUD/文章列表/文章详情/文章统计信息/高级搜索/批量更新/推荐文章/浏览量
- [x] 重写`tags`接口,包含CRUD/标签列表/标签详情/标签统计信息/批量操作
- [x] 固定`vue`/`vue-router`版本
- [ ] 
- [ ] 移动端适配
- [ ] 自动化部署`CI/CD`

## Bug fixs

- [x] 修复toc显示不全的bug
