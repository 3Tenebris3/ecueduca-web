import {
  Drawer,
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
  useQuestions,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion
} from '../../features/quizzes/hooks';
import QuestionDialog from './QuestionDialog';

import { useState } from 'react';
import type {
  QuizSetDTO,
  QuizQuestionDTO,
} from '../../api/quizzes/quizzes.types';

interface Props {
  open: boolean;
  onClose: () => void;
  quiz: QuizSetDTO;
}

export default function QuestionsDrawer({ open, onClose, quiz }: Props) {
  const { data: qs = [] } = useQuestions(quiz.id);
  const add = useAddQuestion(quiz.id);
  const update = useUpdateQuestion(quiz.id);
  const del = useDeleteQuestion(quiz.id);

  const [openQ, setOpenQ] = useState(false);
  const [editing, setEditing] = useState<QuizQuestionDTO | null>(null);
  const [snack, setSnack] = useState('');

  /* guardar */
  const handleSave = async (data: { prompt: string; choices: string[]; answer: number }) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, dto: data });
      setSnack('Pregunta actualizada');
    } else {
      await add.mutateAsync(data);
      setSnack('Pregunta creada');
    }
    setOpenQ(false);
  };


  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 380, p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}
          >
            <h3 style={{ margin: 0, fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>{quiz.title}</h3>

            <Tooltip title="Nueva pregunta">
              <IconButton
                onClick={() => {
                  setEditing(null);
                  setOpenQ(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <List dense>
            {qs.map((q) => (
              <ListItem key={q.id} divider>
                <ListItemText primary={q.prompt}/>

                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditing(q);
                      setOpenQ(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => del.mutate(q.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* diálogo pregunta */}
      {openQ && (
        <QuestionDialog
          open={openQ}
          onClose={() => setOpenQ(false)}
          initial={editing ?? undefined}
          onSave={handleSave}
        />
      )}

      <Snackbar
        open={!!snack}
        autoHideDuration={2500}
        message={snack}
        onClose={() => setSnack('')}
      />
    </>
  );
}
