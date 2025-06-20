import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger'

import { AuthenticatedGuard } from '@/user/auth.guard'
import { CategoryService } from './category.service'
import { MajorCategoryPayload, MajorCategoryResponse, MajorCategoryUpdatePayload } from './dto/major-category.dto'
import { MiddleCategoryPayload, MiddleCategoryResponse, MiddleCategoryUpdatePayload } from './dto/middle-category.dto'
import { AllCategoryResponse } from './dto/all-category.dto'

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('major')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '대분류 추가',
    description: '새로운 대분류를 생성합니다.',
  })
  @ApiBody({
    type: MajorCategoryPayload,
    description: '대분류 생성 정보',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '대분류가 성공적으로 생성되었습니다.',
    type: MajorCategoryResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async createMajorCategory(
    @Body() payload: MajorCategoryPayload,
    @Request() req: any,
  ): Promise<MajorCategoryResponse> {
    return this.categoryService.createMajorCategory(payload, req.user.id)
  }

  @Get('major')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '대분류 조회',
    description: '사용자의 대분류 목록을 조회합니다. name 파라미터로 필터링 가능합니다.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '대분류 이름으로 필터링 (부분 일치)',
    example: '식비',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '대분류 목록이 성공적으로 조회되었습니다.',
    type: [MajorCategoryResponse],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  async getMajorCategories(
    @Query('name') name?: string,
    @Request() req?: any,
  ): Promise<MajorCategoryResponse[]> {
    return this.categoryService.getMajorCategories(req.user.id, name)
  }

  @Put('major')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '대분류 수정',
    description: '기존 대분류의 이모지와 라벨을 수정합니다.',
  })
  @ApiBody({
    type: MajorCategoryUpdatePayload,
    description: '대분류 수정 정보 (ID 포함)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '대분류가 성공적으로 수정되었습니다.',
    type: MajorCategoryResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '대분류를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async updateMajorCategory(
    @Body() payload: MajorCategoryUpdatePayload,
    @Request() req: any,
  ): Promise<MajorCategoryResponse> {
    return this.categoryService.updateMajorCategory(req.user.id, payload)
  }

  @Delete('major/:id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '대분류 삭제',
    description: '기존 대분류를 삭제합니다. (Soft Delete)',
  })
  @ApiParam({
    name: 'id',
    description: '삭제할 대분류 ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '대분류가 성공적으로 삭제되었습니다.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '대분류가 성공적으로 삭제되었습니다.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '대분류를 찾을 수 없습니다.',
  })
  async deleteMajorCategory(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    return this.categoryService.deleteMajorCategory(id, req.user.id)
  }

  @Get('middle')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '중분류 조회',
    description: '사용자의 중분류 목록을 조회합니다. name과 id 파라미터로 필터링 가능합니다.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '중분류 이름으로 필터링 (부분 일치)',
    example: '점심',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: '대분류 ID로 필터링',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '중분류 목록이 성공적으로 조회되었습니다.',
    type: [MiddleCategoryResponse],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  async getMiddleCategories(
    @Query('name') name?: string,
    @Query('id') majorCategoryId?: string,
    @Request() req?: any,
  ): Promise<MiddleCategoryResponse[]> {
    const parsedMajorCategoryId = majorCategoryId ? parseInt(majorCategoryId, 10) : undefined
    return this.categoryService.getMiddleCategories(req.user.id, name, parsedMajorCategoryId)
  }

  @Post('middle')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '중분류 추가',
    description: '새로운 중분류를 생성합니다.',
  })
  @ApiBody({
    type: MiddleCategoryPayload,
    description: '중분류 생성 정보',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '중분류가 성공적으로 생성되었습니다.',
    type: MiddleCategoryResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async createMiddleCategory(
    @Body() payload: MiddleCategoryPayload,
    @Request() req: any,
  ): Promise<MiddleCategoryResponse> {
    return this.categoryService.createMiddleCategory(payload, req.user.id)
  }

  @Put('middle')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '중분류 수정',
    description: '기존 중분류의 이모지와 라벨을 수정합니다.',
  })
  @ApiBody({
    type: MiddleCategoryUpdatePayload,
    description: '중분류 수정 정보 (ID 포함)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '중분류가 성공적으로 수정되었습니다.',
    type: MiddleCategoryResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '중분류를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터입니다.',
  })
  async updateMiddleCategory(
    @Body() payload: MiddleCategoryUpdatePayload,
    @Request() req: any,
  ): Promise<MiddleCategoryResponse> {
    return this.categoryService.updateMiddleCategory(req.user.id, payload)
  }

  @Delete('middle/:id')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '중분류 삭제',
    description: '기존 중분류를 삭제합니다. (Soft Delete)',
  })
  @ApiParam({
    name: 'id',
    description: '삭제할 중분류 ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '중분류가 성공적으로 삭제되었습니다.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '중분류가 성공적으로 삭제되었습니다.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '중분류를 찾을 수 없습니다.',
  })
  async deleteMiddleCategory(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    return this.categoryService.deleteMiddleCategory(id, req.user.id)
  }

  @Get('all')
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: '전체 카테고리 조회',
    description: '사용자의 대분류와 중분류를 모두 조회하여 하나의 배열로 반환합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '전체 카테고리 목록이 성공적으로 조회되었습니다.',
    type: [AllCategoryResponse],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증되지 않은 요청입니다.',
  })
  async getAllCategories(@Request() req: any): Promise<AllCategoryResponse[]> {
    return this.categoryService.getAllCategories(req.user.id)
  }
} 