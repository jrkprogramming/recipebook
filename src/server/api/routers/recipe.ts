import { z } from "zod";
import {
	createTRPCRouter,
	// publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
	getAll: protectedProcedure.query(({ ctx }) => {
		return ctx.prisma.recipe.findMany({
			where: {
				userId: ctx.session.user.id
			}
		});
	}),

	edit: protectedProcedure
		.input(z.object({ id: z.string(), mealName: z.string(), notes: z.string(), protein: z.number(), fat: z.number(), carbs: z.number(), calories: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.recipe.update({
				where: {
					id: input.id,
				},
				data: {
					mealName: input.mealName,
					notes: input.notes,
					protein: input.protein,
					fat: input.fat,
					carbs: input.carbs,
					calories: input.calories,
					userId: ctx.session.user.id,
				},
			});
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.recipe.delete({
				where: {
					id: input.id,
				},
			});
		}),

	create: protectedProcedure
		.input(z.object({ mealName: z.string(), notes: z.string(), protein: z.number(), fat: z.number(), carbs: z.number(), calories: z.number() }))
		.mutation(({ ctx, input }) => {
			return ctx.prisma.recipe.create({
				data: {
					mealName: input.mealName,
					notes: input.notes,
					protein: input.protein,
					fat: input.fat,
					carbs: input.carbs,
					calories: input.calories,
					userId: ctx.session.user.id,
				}
			})
		})
})
