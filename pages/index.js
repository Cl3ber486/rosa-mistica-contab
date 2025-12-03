import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Seus detalhes de conexão (que o Vercel já injetou)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function HomePage() {
    const [statusMsg, setStatusMsg] = useState('Carregando...');

    useEffect(() => {
        async function fetchStatus() {
            // 1. Faz a busca na tabela 'status'
            const { data, error } = await supabase
                .from('status')
                .select('mensagem') // Seleciona apenas a coluna 'mensagem'
                .single(); // Espera apenas um registro

            if (error) {
                console.error('Erro ao buscar status:', error);
                setStatusMsg('Erro ao conectar ao Supabase!');
            } else {
                // 2. Define a mensagem com o valor retornado
                setStatusMsg(data.mensagem);
            }
        }

        fetchStatus();
    }, []);

    // 3. Exibe a mensagem na tela
    return (
        <div>
            <h1>Status da Aplicação</h1>
            <p>Teste de Integração Supabase/Vercel:</p>
            <h2>{statusMsg}</h2>
        </div>
    );
}

export default HomePage;