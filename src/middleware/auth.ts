import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Estende a interface Request para incluir as informações do admin
export interface AuthRequest extends Request {
  admin?: {
    id: string | number;
    laneNumber: number;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decodifica o token para obter id e laneNumber
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      laneNumber: number;
    };

    // Adiciona as informações do admin à requisição
    req.admin = { id: decoded.id, laneNumber: decoded.laneNumber };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
  }
};
