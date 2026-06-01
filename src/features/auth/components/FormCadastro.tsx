'use client'

import Link from 'next/link'
import { useCadastro } from '../hooks/useCadastro'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { User, Mail, Lock, Store } from 'lucide-react'

export function FormCadastro() {
  const { register, onSubmit, errors, isLoading } = useCadastro()

  return (
    <Card className="w-full max-w-md p-6 shadow-lg border-muted/40">
      <CardContent className="space-y-6 pt-6">
        {/* Header do Design */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-200">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SGPV</h1>
          <p className="text-sm text-muted-foreground">Sistema de Gestão de Vendas</p>
          <h2 className="text-md font-semibold text-slate-700 pt-2">Crie sua Conta</h2>
        </div>

        {/* Formulário */}
        <form onSubmit={onSubmit} className="space-y-4">
          
          {/* Campo: Nome */}
          <div className="space-y-1">
            <Label htmlFor="nome">Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="nome"
                placeholder="Seu nome completo"
                className="pl-10"
                {...register('nome')}
              />
            </div>
            {errors.nome && (
              <p className="text-xs text-destructive font-medium animate-in fade-in-50">
                • {errors.nome.message}
              </p>
            )}
          </div>

          {/* Campo: E-mail */}
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium animate-in fade-in-50">
                • {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo: Senha */}
          <div className="space-y-1">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="senha"
                type="password"
                placeholder="No mínimo 8 caracteres"
                className="pl-10"
                {...register('senha')}
              />
            </div>
            {errors.senha && (
              <p className="text-xs text-destructive font-medium animate-in fade-in-50">
                • {errors.senha.message}
              </p>
            )}
          </div>

          {/* Botão de Ação */}
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11">
            {isLoading ? 'Criando conta...' : 'Cadastrar'}
          </Button>
        </form>

        {/* Footer do Card */}
        <div className="text-center text-sm text-muted-foreground pt-2">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}