import { Controller, Get, Post, Body, Patch, UsePipes, UploadedFile,
   ValidationPipe,  Param, Delete, UseGuards, UseInterceptors, Res,
    ClassSerializerInterceptor, } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Query, Req } from '@nestjs/common';
import { Request, Express, Response } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/user.decorator';
import { CurrentUserGuard } from 'src/auth/current-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ACGuard, UseRoles } from 'nest-access-control'

@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)

export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'create',
    resource: 'posts'
  })
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request,  @CurrentUser() user: User) {
    // @ts-ignore
    return this.postService.create(createPostDto, req.user as User);
  }

  @Get()
  @UseGuards(CurrentUserGuard)
  findAll(@Query() query: any, @CurrentUser() user: User) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

@Get('/slug/:slug')
findBySlug(@Param('slug') slug: string) {
  return this.postService.findBySlug(slug)
}

@Post('upload-img')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0]
      const fileExt = file.originalname.split('.')[1]
      const newFileName = name.split(' ').join('_')+'_'+Date.now() + '.' + fileExt

      callback(null, newFileName)
    }
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|)$/)) {
      return callback(null, false)
    }
    callback(null, true)
  }
}))
uploadImg(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('File is not an image!')
  } else {
    const response = {
      filePath: `http://localhost:3000/post/pictures/${file.filename}`
    }

    return response
  }
}

@Get('pictures/:filename')
async getPicture(@Param('filename') filename, @Res() res: Response) {
  res.sendFile(filename, {
    root: './uploads'
  })
}

  @Patch(':slug')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'update',
    resource: 'posts'
  })
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    possession: 'any',
    action: 'delete',
    resource: 'posts'
  })
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
