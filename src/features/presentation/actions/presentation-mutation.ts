import { createServerFn } from '@tanstack/react-start';
import {
  createPresentationInputSchema,
  presentationIdInputSchema,
  updatePresentationInputSchema,
} from '../types/schema';
import { authFnMiddleware } from '#/middlewares/auth';
import { prisma } from '#/db';
import { generateSlug } from 'random-word-slugs';
import { PresentationStatus } from '#/generated/prisma/enums';

export const createPresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createPresentationInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context?.session?.user.id;

    const presentation = await prisma.presentation.create({
      data: {
        userId,
        title: generateSlug(),
        prompt: data.prompt,
        slideCount: data.slideCount,
        style: data.style,
        tone: data.tone,
        layout: data.layout,
        status: PresentationStatus.GENERATING,
      },
    });

    // TODO: setup inngest

    return presentation;
  });

export const updatePresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => updatePresentationInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context?.session?.user.id;
    const { id, ...patch } = data;

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });

    if (!existing)
      throw new Error(
        'Presentation not found or you do not have permission to update it',
      );
    const updateData = patch;

    const presentation = await prisma.presentation.update({
      where: {
        id,
      },
      data: updateData,
    });

    return presentation;
  });

export const deletePresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => presentationIdInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context?.session?.user.id;
    const { id } = data;

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });

    if (!existing)
      throw new Error(
        'Presentation not found or you do not have permission to delete it',
      );

    await prisma.presentation.delete({
      where: {
        id,
      },
    });

    return { ok: true as const };
  });

export const regeneratePresentation = createServerFn({ method: 'POST' })
  .validator((data: unknown) => presentationIdInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context?.session?.user.id;
    const { id } = data;

    const existing = await prisma.presentation.findFirst({
      where: { id, userId },
    });

    if (!existing)
      throw new Error(
        'Presentation not found or you do not have permission to regenerate it',
      );

    await prisma.presentation.update({
      where: { id },
      data: { status: PresentationStatus.GENERATING },
    });

    // TODO: setup inngest

    return { ok: true as const };
  });
