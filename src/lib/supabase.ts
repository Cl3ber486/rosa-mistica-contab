import { createClient } from '@supabase/supabase-js'

// As variáveis de ambiente são injetadas em tempo de build pelo Next.js.
// O uso do operador "!" garante que, se a variável não existir, o build falhará
// (isso evita que o código caia no fallback "placeholder.supabase.co").
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// DEBUG: exibe a URL que o bundle recebeu (apenas para desenvolvimento).
if (typeof window !== 'undefined') {
    console.log('🚀 Supabase URL (injetada):', supabaseUrl)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
