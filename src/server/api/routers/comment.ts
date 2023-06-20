import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
export const commentRouter = createTRPCRouter({

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.comment.delete({
				where: {
					id: input.id,
				},
			});
		}),


	create: protectedProcedure
		.input(
			z.object({ title: z.string(), content: z.string(), recipeId: z.string() })
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.comment.create({
				data: {
					title: input.title,
					recipeId: input.recipeId,
					content: input.content,
				},
			});
		}),

	getAll: protectedProcedure
		.input(z.object({ recipeId: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.prisma.comment.findMany({
				where: {
					recipeId: input.recipeId,
				},
			});
		}),
})
