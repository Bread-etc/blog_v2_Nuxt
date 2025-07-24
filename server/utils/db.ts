import { PrismaClient } from '@prisma/client'

declare global {
    var __prisma: PrismaClient | undefined
}

// 创建 Prisma 实例
const createPrismaClient = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

// 在开发环境中使用全局变量避免热重载时创建多个实例
// 在生产环境中直接创建实例
const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma
}

export { prisma }