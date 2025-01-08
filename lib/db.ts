import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

class PrismaSingleton {
  private static instance: PrismaClient

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      if (process.env.NODE_ENV === 'production') {
        PrismaSingleton.instance = new PrismaClient()
      } else {
        if (!global.prisma) {
          global.prisma = new PrismaClient()
        }
        PrismaSingleton.instance = global.prisma
      }
    }
    return PrismaSingleton.instance
  }
}

const prisma = PrismaSingleton.getInstance()
export default prisma