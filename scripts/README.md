# 管理脚本

## createAdmin.js - 创建管理员账户

用于创建博客系统的管理员账户。

### 使用方法

#### 1. 交互式输入（最安全，推荐）

```bash
node scripts/createAdmin.js
```

脚本会提示您输入密码，输入时密码会被隐藏显示为 `*`

#### 2. 环境变量文件方式（推荐）

在 `.env.development` 或 `.env.production` 中添加：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=admin@yourdomain.com
```

然后运行：

```bash
node scripts/createAdmin.js
```

#### 3. 临时环境变量方式

```bash
# Windows PowerShell
$env:ADMIN_PASSWORD="your_password"; node scripts/createAdmin.js; Remove-Item Env:ADMIN_PASSWORD

# Linux/Mac
ADMIN_PASSWORD=your_password node scripts/createAdmin.js
```

#### 4. 命令行参数方式（不推荐，密码会出现在命令历史中）

```bash
node scripts/createAdmin.js admin mypassword admin@myblog.com
```

### 安全注意事项

1. **生产环境**：务必使用强密码
2. **环境变量**：推荐使用环境变量方式，避免密码出现在命令历史中
3. **执行后清理**：建议执行完成后清理环境变量或命令历史

### 错误处理

- 如果用户名或邮箱已存在，脚本会提示错误
- 数据库连接失败时会显示相应错误信息
- 脚本执行完成后会自动断开数据库连接
