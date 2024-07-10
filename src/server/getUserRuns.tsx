"use server";

import { connectToMongoDB, getRuns } from "@/db/db";
//import { runs } from "@/db/schema";
//import { auth } from "@clerk/nextjs/server";
//import { eq, desc } from "drizzle-orm";

export async function getUserRuns(walletAddress: string) {
	//const { userId } = auth();
	//if (!userId) throw new Error("User not found");

	// return []
	// return [
	// 	{
	// 		run_id: "123",
	// 		createdAt: 123,
	// 	},
	// 	{
	// 		run_id: "1232",
	// 		createdAt: 123,
	// 	},
	// ];
	//return 

	// return db
	// 	.select()
	// 	.from(runs)
	// 	.where(eq(runs.user_id, userId))
	// 	.orderBy(desc(runs.createdAt));
}
