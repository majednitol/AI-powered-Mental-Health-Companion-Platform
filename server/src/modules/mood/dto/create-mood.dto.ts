import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';
export class CreateMoodDto {
@IsInt()
moodScale: number;
@IsArray()
@IsOptional()
emotions?: string[];
@IsString()
@IsOptional()
notes?: string;
@IsOptional()
date?: string;
}