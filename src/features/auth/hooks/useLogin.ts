'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '../type'
import { toast } from 'sonner'

export function useLogin() {
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
    } catch (error) {
      toast.error('Credenciais inválidas.')
    } finally {
      setIsLoading(false)
    }
  }

  return { register, handleSubmit, errors, isLoading }
}