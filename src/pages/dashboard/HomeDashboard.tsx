import { useAuth } from '../../core/auth';
import { Link } from 'react-router-dom';

import Box            from '@mui/material/Box';
import Card           from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography     from '@mui/material/Typography';
import Divider        from '@mui/material/Divider';

import GroupIcon        from '@mui/icons-material/Group';
import SchoolIcon       from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QuizIcon from '@mui/icons-material/Quiz';
import type { JSX } from 'react';

interface StatCard {
  label:    string;
  subtitle: string;
  icon:     JSX.Element;
  route:    string;
  color:    string;
  role?:    'admin' | 'profesor' | 'any';
}

export default function HomeDashboard() {
  const { state } = useAuth();
  const name = state.user?.displayName ?? '';
  const role = state.user?.role ?? '';

  const cards: StatCard[] = [
    { label:'Usuarios',       subtitle:'Gestión completa', icon:<GroupIcon sx={{ fontSize:48 }} />,         route:'/dashboard/users',   color:'#6366F1', role:'admin' },
    { label:'Clases', subtitle:'Gestión grupos', icon:<SchoolIcon sx={{fontSize:48}}/>, route:'/dashboard/classes', color:'#10B981', role:'any'  },
    { label:'Minijuegos',     subtitle:'Trivia/quiz',   icon:<SportsEsportsIcon sx={{ fontSize:48 }} />, route:'/dashboard/quizzes', color:'#F59E0B', role:'admin'  },
    { label:'Cuestionarios', subtitle:'Preguntas y sets', icon:<QuizIcon sx={{fontSize:48}}/>, route:'/dashboard/quizzes', color:'#F59E0B', role:'admin'  },
    { label:'Reportes', subtitle:'Estadísticas y datos', icon:<SchoolIcon sx={{fontSize:48}}/>, route:'/dashboard/reports', color:'#4CAF50', role:'admin'  },
  ];

  return (
    <Box>
      {/* Saludo */}
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 4,
          WebkitBackgroundClip: 'text',
          color: '#000'
        }}
      >
        ¡Hola {name}!
      </Typography>

      {/* Cuadrícula responsiva con Box */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',          // móviles
            sm: 'repeat(2, 1fr)',// tablet
            md: 'repeat(3, 1fr)' // desktop
          }
        }}
      >
        {cards.map(c => (
          (c.role === role || c.role === 'any') && (
            <Card key={c.label} sx={{ p: 3 }}>
              <CardActionArea component={Link} to={c.route} sx={{ textAlign:'center', py:4 }}>
          <Box sx={{ color:c.color, mb:2 }}>{c.icon}</Box>
          <Typography variant="h6" fontWeight={600}>{c.label}</Typography>
          <Divider sx={{ my:1, width:60, mx:'auto' }}/>
          <Typography variant="body2" color="text.secondary">{c.subtitle}</Typography>
              </CardActionArea>
            </Card>
          )
        ))}
      </Box>
    </Box>
  );
}
