利用Nuxt重构博客前后端项目[hastur23.top]

- 添加 PrimeVue 和 tailwindcss
- 添加字体 ~~LXGW WenKai webfont~~,Pingfang SC

### update

- 添加`vueuse`
- 添加深色浅色模式切换
- 分离`tailwindcss.config.ts`配置文件
- 利用`$fetch`封装拦截器interceptor
- 添加`nuxt-lodash`
- 引入`utteranc`评论功能
- 添加`styleLint`配置
- 添加`error.vue`错误页
- 添加`markdown`解析器`@nuxt/content`
- 使用`layout`布局

## backend design

- 采用原生`nitro` + `prisma`
- 采用~~`MySQL`~~,`postgresql`
- 添加`jsonwebtoken`鉴权
- 完成`category`增删改查接口
- 完成`post`增删改查接口

## Optimization objective
- 移动端/大小屏/竖屏适配