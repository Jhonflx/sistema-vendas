'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '../type'
import { toast } from 'sonner'

export function useLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      console.log('[BACKEND MOCK] Tentativa de login com:', data.email)
      toast.success('Login realizado com sucesso! Entrando no sistema...')
      router.push('/perfil')
    } catch (error) {
      toast.error('Credenciais inválidas.')
    } finally {
      setIsLoading(false)
    }
  }

  return { register, onSubmit: handleSubmit(onSubmit), errors, isLoading }
}