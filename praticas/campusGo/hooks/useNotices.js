
import { useState, useEffect, useCallback } from 'react';
import { get } from '../services/api';

// Avisos fictícios para demonstração do CampusGo
const avisosCampus = [
  {
    title: 'Inscrições abertas para monitoria acadêmica',
    body: 'Estão abertas as inscrições para o programa de monitoria. Os alunos interessados devem procurar a coordenação do curso até sexta-feira.',
  },
  {
    title: 'Semana de tecnologia e inovação',
    body: 'Participe da semana de tecnologia do campus! Teremos palestras, oficinas práticas e apresentações de projetos desenvolvidos pelos estudantes.',
  },
  {
    title: 'Biblioteca com horário especial',
    body: 'Durante o período de avaliações, a biblioteca funcionará em horário estendido, das 8h às 22h. Aproveite o espaço para organizar seus estudos.',
  },
  {
    title: 'Calendário de avaliações disponível',
    body: 'O calendário de provas já está disponível. Consulte as datas das avaliações no portal acadêmico e organize seu planejamento.',
  },
  {
    title: 'Palestra sobre inteligência artificial',
    body: 'Na próxima quarta-feira, às 19h, acontecerá uma palestra sobre inteligência artificial e suas aplicações no mercado de trabalho. A participação é gratuita.',
  },
  {
    title: 'Campanha de arrecadação solidária',
    body: 'O campus está promovendo uma campanha de arrecadação de alimentos e produtos de higiene. As doações podem ser entregues na recepção.',
  },
  {
    title: 'Manutenção dos laboratórios',
    body: 'Os laboratórios de informática passarão por manutenção nesta sexta-feira, das 14h às 18h. Durante esse período, os espaços ficarão temporariamente indisponíveis.',
  },
  {
    title: 'Oportunidade de estágio',
    body: 'Está disponível uma oportunidade fictícia de estágio na área de tecnologia da informação. Procure o setor de carreira para conhecer os requisitos e orientações.',
  },
  {
    title: 'Projeto de extensão universitária',
    body: 'Estão abertas as inscrições para novos participantes dos projetos de extensão. Essa é uma oportunidade de desenvolver habilidades e contribuir com a comunidade.',
  },
  {
    title: 'Prazo para renovação de matrícula',
    body: 'Fique atento ao prazo de renovação de matrícula para o próximo semestre. Consulte o calendário acadêmico para não perder a data.',
  },
];

export default function useNotices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotices = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Consulta a API configurada no arquivo .env
      const data = await get('posts?_limit=10');

      // Utiliza os registros da API e apresenta conteúdos fictícios em português
      const avisosFormatados = data.map((item, index) => ({
        id: item.id,
        title: avisosCampus[index % avisosCampus.length].title,
        body: avisosCampus[index % avisosCampus.length].body,
      }));

      setNotices(avisosFormatados);
    } catch (err) {
      setError(err.message || 'Erro ao carregar os avisos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  return {
    notices,
    isLoading,
    error,
    reload: loadNotices,
  };
}
