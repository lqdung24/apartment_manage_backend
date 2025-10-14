import {Controller, Get, Req, Post, HttpCode, Param, Body, Query} from '@nestjs/common';
import type { Request } from 'express';
import {Observable, of} from "rxjs";
import {CreatCatDTO} from "./create-cat.dto";

@Controller('cats')
export class CatsController {
    @Get()
    findAll(@Req() req: Request): string{
        console.log(req.params)
        return 'Return all cats';
    }

    @Get(':id')
    findOne(@Param() par: any): string{
        return `This action return a ${par.id} cat`;
    }

    //sub domain routing: 1 backend phục vụ nhiều tên miền
    // cái này sẽ tạo controller phục vụ riêng cho từng tên miền cụ thể

    //async
    @Get('/all')
    findAll2(): Observable<any[]>{
        return of([]);
    }

    //request payload
    @Post()
    async create(@Body() cat: CreatCatDTO): Promise<string>{
        return 'This add a new cat';
    }

    //query params: get /catt?age=2&name=dung
    @Get()
    async findQuery(@Query('age') age: number, @Query('name') name: string){
        return `This action return cat with age=${age} and name is ${name}`;
    }
}
