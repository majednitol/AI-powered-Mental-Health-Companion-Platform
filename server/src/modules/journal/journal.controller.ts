// import { Controller, Post, Get, Param, Body, Req, UseGuards, Query } from
//     '@nestjs/common';
// import { AuthGuard } from '../../auth/auth.guard';
// import { storage } from '../storage/storage.impl';
// import { CreateJournalDto } from './dto/create-journal.dto';
// @Controller('api/journal-entries')
// export class JournalController {
//     @UseGuards(AuthGuard)
//     @Post()
//     async create(@Req() req: any, @Body() body: CreateJournalDto) {
//         const userId = req.user.claims.sub;
//         const entry = await storage.createJournalEntry({ ...body, userId } as any);
//         return entry;
//     }
//     @UseGuards(AuthGuard)
//     @Get()
//     async list(@Req() req: any, @Query('limit') limit?: string) {
//         const userId = req.user.claims.sub;
//         const l = limit ? parseInt(limit, 10) : undefined;
//         const entries = await storage.getJournalEntries(userId, l);
//         return entries;
//     }
//     @UseGuards(AuthGuard)
//     @Get(':id')
//     async get(@Req() req: any, @Param('id') id: string) {
//         const userId = req.user.claims.sub;
//         const entry = await storage.getJournalEntry(id, userId);
//         if (!entry) {
//             return { message: 'Not found' };
//         }
//         return entry;
//     }
// }