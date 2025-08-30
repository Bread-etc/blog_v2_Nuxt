import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { createInterface } from "readline";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
config({ path: join(__dirname, "..", envFile) });

// 如果没有找到环境变量文件，尝试加载默认的 .env
if (!process.env.DATABASE_URL) {
  config({ path: join(__dirname, "..", ".env") });
}

const prisma = new PrismaClient();

// 交互式密码输入函数
function askPassword(question) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // 隐藏密码输入
    rl.stdoutMuted = true;
    rl.question(question, (answer) => {
      rl.close();
      console.log(); // 换行
      resolve(answer);
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted) {
        rl.output.write("*");
      } else {
        rl.output.write(stringToWrite);
      }
    };
  });
}

async function createAdmin() {
  try {
    // 从命令行参数或环境变量获取信息
    let username = process.argv[2] || process.env.ADMIN_USERNAME || "admin";
    let password = process.argv[3] || process.env.ADMIN_PASSWORD;

    // 如果没有提供密码，交互式输入
    if (!password) {
      console.log("未检测到密码，请交互式输入：");
      password = await askPassword("请输入管理员密码: ");

      if (!password || password.trim() === "") {
        console.log("❌ 密码不能为空");
        return;
      }
    }

    console.log("正在创建管理员账户...");
    console.log("用户名:", username);

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { userName: username },
    });

    if (existingUser) {
      console.log("❌ 用户已存在:", username);
      console.log("如需重置密码，请先删除现有用户或使用不同的用户名");
      return;
    }

    // 创建管理员
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        userName: username,
        password: hashedPassword,
        nickName: username, // 使用用户名作为昵称
      },
    });

    console.log("✅ 管理员账户创建成功!");
    console.log("用户名:", admin.userName);
    console.log("昵称:", admin.nickName);
    console.log("用户ID:", admin.id);
    console.log("创建时间:", admin.createdTime);
  } catch (error) {
    console.error("❌ 创建管理员账户失败:", error.message);

    if (error.code === "P2002") {
      console.log("提示: 用户名或邮箱已存在，请使用不同的值");
    }
  } finally {
    await prisma.$disconnect();
  }
}

// 显示使用说明
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
创建管理员账户脚本

安全使用方法（推荐顺序）:

1. 交互式输入（最安全）:
   node scripts/createAdmin.js
   脚本会提示您安全地输入密码

2. 环境变量文件:
   在 .env.development 或 .env.production 中设置:
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ADMIN_EMAIL=admin@yourdomain.com
   
   然后运行: node scripts/createAdmin.js

3. 临时环境变量:
   Windows: $env:ADMIN_PASSWORD="your_password"; node scripts/createAdmin.js; Remove-Item Env:ADMIN_PASSWORD
   Linux/Mac: ADMIN_PASSWORD=your_password node scripts/createAdmin.js

4. 命令行参数（不推荐，密码会保存在命令历史中）:
   node scripts/createAdmin.js admin mypassword admin@myblog.com

注意:
  - 密码会自动进行 bcrypt 哈希处理
  - 用户名和邮箱必须唯一
  - 推荐使用强密码
`);
  process.exit(0);
}

createAdmin();
