'use client'

import Link from 'next/link'
import { useLogin } from '../hooks/useLogin'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Mail, Lock, Store } from 'lucide-react'

export function FormLogin() {
  const { register, handleSubmit, errors, isLoading } = useLogin()

  return (
    <Card className="w-full max-w-md p-6 shadow-lg border-muted/40">
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SGPV</h1>
          <p className="text-sm text-muted-foreground">Sistema de Gestão de Vendas</p>
          <h2 className="text-md font-semibold text-slate-700 pt-2">Acesse sua Conta</h2>
        </div>

        <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input id="email" type="email" placeholder="usuario@exemplo.com" className="pl-10" disabled={isLoading} {...register('email')} />
            </div>
            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha">Senha</Label>
              {/* O TEXTINHO PEQUENO QUE VOCÊ QUERIA AQUI 👇 */}
              <Link href="/esqueci-senha" className="text-xs text-blue-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <Input id="senha" type="password" placeholder="••••••••" className="pl-10" disabled={isLoading} {...register('senha')} />
            </div>
            {errors.senha && <p className="text-xs font-medium text-red-500">{errors.senha.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-600 pt-2">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="text-blue-600 font-medium hover:underline">
            Cadastrar-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}