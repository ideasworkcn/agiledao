"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = 'Login failed'
        
        // Handle specific error cases with more detailed messages
        switch (response.status) {
          case 400:
            errorMessage = 'Email and password are required'
            break
          case 401:
            if (errorData.message === 'No account found with this email address') {
              errorMessage = 'No account found with this email address'
            } else if (errorData.message === 'This account has no password set. Please reset your password.') {
              errorMessage = 'Account not properly set up. Please reset your password.'
            } else if (errorData.message === 'Incorrect password. Please try again.') {
              errorMessage = 'Incorrect password. Please try again.'
            } else {
              errorMessage = errorData.message || 'Invalid credentials'
            }
            break
          case 500:
            errorMessage = 'Server error, please try again later'
            break
          default:
            errorMessage = errorData.message || 'Login failed'
        }
        throw new Error(errorMessage)
      }

      const { token } = await response.json()
       
       // Fetch user info using token
       const userResponse = await fetch('/api/auth/me');
       
       if (!userResponse.ok) {
         throw new Error('Failed to fetch user information');
       }
       
       const userData = await userResponse.json();
       
       // Store user info in localStorage
       localStorage.setItem('user', JSON.stringify(userData));
       localStorage.setItem('user_id', userData.id); // Store user ID separately for convenience
       localStorage.setItem('user_role', userData.role);
       localStorage.setItem('user_name', userData.name);
       localStorage.setItem('user_email', userData.email);
       // Redirect using server-side approach
      window.location.href = '/workspace'
      
    } catch (err) {
      let errorMessage = 'Login failed'
      if (err instanceof Error) {
        errorMessage = err.message
        // Handle specific error cases
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error, please check your connection'
        }
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
  )
}
