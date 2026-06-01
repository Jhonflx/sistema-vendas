'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cadastroSchema, CadastroFormData } from '../type'
import { toast } from 'sonner' 

export function useCadastro() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  })

  const onSubmit = async (data: CadastroFormData) => {
    setIsLoading(true)
    
    try {
      // Simulação de chamada de API (Unicidade de conta)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (data.email === 'usuario@exemplo.com') {
        toast.error('Este e-mail já está cadastrado na base de dados.')
        return
      }

      toast.success('Conta criada com sucesso! Bem-vindo ao SGPV.')
      router.push('/') // Redireciona para a home/dashboard logada
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Tente novamente.')
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