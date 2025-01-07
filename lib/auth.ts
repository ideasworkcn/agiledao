import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined')
}
const SALT_ROUNDS = 10
const secret = new TextEncoder().encode(JWT_SECRET)

// Generate JWT token with extended user information
export const generateToken = async (user_id: string, role: string, email: string, name: string, status: string,position?: string,) => {
  if (!user_id || !role) {
    throw new Error('user_id and roles are required')
  }
  
  return await new SignJWT({ 
    user_id, 
    role,
    email,
    name,
    position,
    status
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret)
}

// Verify JWT token
export const verifyToken = async (token: string) => {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    if (!payload.user_id || !payload.role) {
      console.error('Invalid token structure')
      return null
    }
    return payload as { 
      user_id: string; 
      role: string;
      email?: string;
      name?: string;
      position?: string;
      status?: string;
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Hash password
export const hashPassword = async (password: string) => {
  if (!password) {
    throw new Error('Password is required')
  }
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Compare password with hash
export const comparePassword = async (password: string, hash: string) => {
  if (!password || !hash) {
    throw new Error('Both password and hash are required')
  }
  return await bcrypt.compare(password, hash)
}