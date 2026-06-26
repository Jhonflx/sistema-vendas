'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, User, LayoutDashboard, Package, Users, Settings, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Perfil Cliente', href: '/perfil', icon: User },
    { name: 'Dashboard Geral', href: '#', icon: LayoutDashboard, disabled: true },
    { name: 'Produtos', href: '#', icon: Package, disabled: true },
    { name: 'Clientes', href: '#', icon: Users, disabled: true },
    { name: 'Configurações', href: '#', icon: Settings, disabled: true },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. Sidebar para Desktops */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-slate-600 border-r border-slate-100 shrink-0">
        {/* Header da Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-md font-bold text-slate-800 tracking-tight">SGPV</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Gestão de Vendas</p>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.disabled ? '#' : item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : item.disabled
                    ? 'opacity-40 cursor-not-allowed hover:bg-transparent'
                    : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.name}
                {item.disabled && (
                  <span className="ml-auto text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase">
                    Breve
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sair do Sistema
          </Link>
        </div>
      </aside>

      {/* 2. Container Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm font-bold text-slate-800 md:block hidden">Área Logada</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right md:block hidden">
              <p className="text-xs font-bold text-slate-800">Jhon Silva</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Consultor de Vendas</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              JS
            </div>
          </div>
        </header>

        {/* Menu Mobile deslizante */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="w-64 max-w-xs h-full bg-white text-slate-600 border-r border-slate-100 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5">
                <Store className="h-5 w-5 text-blue-600" />
                <span className="text-md font-bold text-slate-850">SGPV</span>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.disabled ? '#' : item.href}
                      onClick={() => !item.disabled && setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : item.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Sair
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Espaço de Conteúdo da Página */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
