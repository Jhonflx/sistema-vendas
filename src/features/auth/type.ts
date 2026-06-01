import { z } from 'zod'

export const cadastroSchema = z.object({
  nome: z.string().min(1, 'O nome completo é obrigatório'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type CadastroFormData = z.infer<typeof cadastroSchema>

export const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').min(1, 'O e-mail é obrigatório'),
  senha: z.string().min(1, 'A senha é obrigatória'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const esqueciSenhaSchema = z.object({
  email: z.string().email('Formato de e-mail inválido').min(1, 'O e-mail é obrigatório'),
})

export type EsqueciSenhaFormData = z.infer<typeof esqueciSenhaSchema>