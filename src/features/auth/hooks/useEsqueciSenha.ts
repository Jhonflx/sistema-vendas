'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { esqueciSenhaSchema, EsqueciSenhaFormData } from '@/features/auth/type'
import { toast } from 'sonner'

export function useEsqueciSenha() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EsqueciSenhaFormData>({
    resolver: zodResolver(esqueciSenhaSchema),
  })

  const onSubmit = async (data: EsqueciSenhaFormData) => {
    setIsLoading(true)
    try {
      // Simulação de chamada de API para gerar e enviar o token por e-mail
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Simula a exibição do token no console para fins de teste no front-end
      const tokenFalso = Math.floor(100000 + Math.random() * 900000)
      console.log(`[BACKEND MOCK] Token enviado para ${data.email}: ${tokenFalso}`)
      
      toast.success('Token de verificação enviado! Verifique sua caixa de entrada.')
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar enviar o e-mail.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    register,
    onSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
  }
}
