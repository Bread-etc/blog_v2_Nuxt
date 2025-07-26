# Nuxt3 重构个人博客

该项目是基于Nuxt3 + Prisma + Tailwindcss + VuePrime + Pinia 构建。
[Bread-etc的个人博客](https://hastur23.top)

## Environment

NodeJs 20.19.0 LTS 环境

## TodoList

- [x] 重写登录`login`接口
- [x] 封装`Prisma`实例类`db.ts`
- [x] 重写`responseWrapper`响应函数,验证Token函数
- [x] 封装用户鉴权函数工具`auth.ts`
- [x] 重构数据库表结构`schema.prisma`
- [x] 重构`categories`分类接口
- [ ] 移动端适配
- [ ] 修复生产开发环境样式不一致问题
- [ ] 文章检索
- [ ] 自动化部署

## Bug fixs

- 修复toc显示不全的bug
