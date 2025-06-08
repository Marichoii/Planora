import { Request, Response } from 'express';

// Simulação de usuários (substituir pelo MongoDB depois)
const users: any[] = [];

// TODO: Substituir por integração real com MongoDB
export const register = (req: Request, res: Response) => {
  users.push(req.body);
  res.json({ message: 'Usuário registrado com sucesso!', user: req.body });
};

// TODO: Substituir por integração real com MongoDB
export const login = (req: Request, res: Response) => {
  const user = users.find(
    u => u.email === req.body.email && u.senha === req.body.senha
  );
  if (user) {
    res.json({ message: 'Login realizado!', user });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
}; 