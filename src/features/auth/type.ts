import { z } from 'zod'

export const cadastroSchema = z.object({
  nome: z.string().min(1, 'O nome completo é obrigatório'),
  email: z.string().email('Formato de e-mail inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type CadastroFormData = z.infer<typeof cadastroSchema>