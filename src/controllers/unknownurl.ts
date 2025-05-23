import { Request, Response } from 'express';

const unknownUrl = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
};

export default unknownUrl;
