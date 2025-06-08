import { Request, Response } from 'express';

// Simulação de projetos (substituir pelo MongoDB depois)
const projects = [
  { userId: '1', name: 'Projeto 1', data: {} },
  { userId: '1', name: 'Projeto 2', data: {} },
  { userId: '2', name: 'Projeto A', data: {} }
];

// TODO: Substituir por integração real com MongoDB
export const getProjects = (req: Request, res: Response) => {
  const userProjects = projects.filter(p => p.userId === req.params.userId);
  res.json(userProjects);
}; 