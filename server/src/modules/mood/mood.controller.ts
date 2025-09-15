// import { Controller, Post, Get, Req, Body, Query, UseGuards } from
//     '@nestjs/common';
// import { AuthGuard } from '../../auth/auth.guard';
// import { storage } from '../storage/storage.impl';
// import { CreateMoodDto } from './dto/create-mood.dto';
// @Controller('api/mood-entries')
// export class MoodController {
//     @UseGuards(AuthGuard)
//     @Post()
//     async create(@Req() req: any, @Body() body: CreateMoodDto) {
//         const userId = req.user.claims.sub;
//         const moodData = {
//             ...body,
//             userId,
//             date: body.date ? new Date(body.date) : new Date(),
//         };
//         const entry = await storage.createMoodEntry(moodData as any);
//         return entry;
//     }
//     @UseGuards(AuthGuard)
//     @Get()
//     async list(@Req() req: any, @Query('limit') limit?: string) {
//         const userId = req.user.claims.sub;
//         const l = limit ? parseInt(limit, 10) : undefined;
//         const entries = await storage.getMoodEntries(userId, l);
//         return entries;
//     }
//     @UseGuards(AuthGuard)
//     @Get('today')
//     async today(@Req() req: any) {
//         const userId = req.user.claims.sub;
//         const entry = await storage.getTodaysMoodEntry(userId);
//         return entry;
//     }
// }