import { Request, Response } from 'express';
import { getNowKO } from '../utils/Date';
import { pool } from '../db';
import { CreateUserDTO } from 'src/users/dto/create.user.dto';

// POST /dev/user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  const user: CreateUserDTO = req.body as CreateUserDTO;
  try {
    const result = await pool.query(
      'INSERT INTO users("email", "nickname", "country", "device_os",  "created_at", "latest_login", "modified_at") VALUES($1,$2,$3,$4,$5,$6,$7)',
      [
        user.email,
        user.nickname,
        user.country,
        user.deviceOs,
        getNowKO(),
        getNowKO(),
        getNowKO()
      ]
    );
    console.log('Success ', result.command);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error.message, error.stack);
    res.status(400).json({ success: false });
  }
};
