import * as Joi from 'joi';

export class MoveTestDto {
  /** ID теста, который нужно переместить */
  testId: string;

  /** ID нового родителя (null, если перемещаем в корень проекта) */
  newParentId?: string | null;

  /** Позиция внутри нового родителя (опционально, если нужно указать порядок) */
  newIndex?: number;
}

// Joi-схема для runtime-валидации
export const MoveTestSchema = Joi.object({
  testId: Joi.string().required(),
  newParentId: Joi.string().allow(null).optional(),
  newIndex: Joi.number().integer().min(0).optional()
});