import { PrismaClient } from '@prisma/client'

// 全局变量，用于缓存 PrismaClient 实例
let prisma: PrismaClient

// 扩展全局类型声明
declare global {
  var prisma: PrismaClient | undefined
}

// 检查是否在生产环境中
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // 在开发环境中，复用全局的 PrismaClient 实例
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma