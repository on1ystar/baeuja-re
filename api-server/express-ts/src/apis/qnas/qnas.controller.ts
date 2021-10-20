import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pool } from '../../db';
import Qna from '../../entities/qna.entity';
import QnaTypeRepository from '../../repositories/qna-type.repository';
import QnaRepository from '../../repositories/qna.repository';

// GET /qnas
export const getQnas = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const client: PoolClient = await pool.connect();
  try {
    const qnas: Qna[] = await QnaRepository.findAllByUserId(client, userId, [
      'qnaId',
      'title',
      'content',
      'answer',
      'createdAt',
      'answeredAt'
    ]);
    return res.status(200).json({ success: true, qnas });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// POST /qnas
export const postQna = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { qna } = req.body;
  const client: PoolClient = await pool.connect();
  // request body 유효성 검사
  try {
    if (
      qna.title === undefined ||
      qna.content === undefined ||
      qna.qnaTypeId === undefined
    )
      throw new Error('invalid the qna object in request body');

    const createdQnaId: number = await QnaRepository.save(client, {
      userId,
      title: qna.title,
      content: qna.content,
      qnaTypeId: +qna.qnaTypeId
    });

    return res.status(200).json({ success: true, qnaId: createdQnaId });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /qnas/:qnaId
export const getQna = async (req: Request, res: Response) => {
  const userId: number = res.locals.userId;
  const { qnaId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    const qna: Qna = await QnaRepository.findOneByUserId(
      client,
      userId,
      +qnaId,
      ['qnaId', 'title', 'content', 'answer', 'createdAt', 'answeredAt']
    );

    return res.status(200).json({ success: true, qna });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// PATCH /qnas/:qnaId
export const answerQna = async (req: Request, res: Response) => {
  const client: PoolClient = await pool.connect();
  const { qnaId } = req.params;
  const { answer } = req.body;
  try {
    const answeredAt: string = await QnaRepository.updateAnswer(
      client,
      +qnaId,
      answer
    );

    return res
      .status(200)
      .json({ success: true, qna: { qnaId, answer, answeredAt } });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// DELETE /qnas/:qnaId
export const remove = async (req: Request, res: Response) => {
  const { qnaId } = req.params;
  const client: PoolClient = await pool.connect();
  try {
    await QnaRepository.delete(client, +qnaId);
    return res.status(200).json({ success: true, qna: { qnaId } });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};

// GET /qnas/types
export const getQnaTypes = async (req: Request, res: Response) => {
  const client: PoolClient = await pool.connect();
  try {
    const qnaTypes: Qna[] = await QnaTypeRepository.findAll(client, [
      'qnaTypeId',
      'name'
    ]);
    return res.status(200).json({ success: true, qnaTypes });
  } catch (error) {
    console.warn(error);
    const errorMessage = (error as Error).message;
    return res.status(400).json({ success: false, errorMessage });
  } finally {
    client.release();
  }
};
