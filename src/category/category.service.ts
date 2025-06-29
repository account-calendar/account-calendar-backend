import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'

import { MajorCategory } from '@/entities/major-category.entity'
import { MiddleCategory } from '@/entities/middle-category.entity'
import { MajorCategoryPayload, MajorCategoryResponse, MajorCategoryUpdatePayload } from './dto/major-category.dto'
import { MiddleCategoryPayload, MiddleCategoryResponse, MiddleCategoryUpdatePayload } from './dto/middle-category.dto'
import { AllCategoryResponse } from './dto/all-category.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(MajorCategory)
    private majorCategoryRepository: Repository<MajorCategory>,
    @InjectRepository(MiddleCategory)
    private middleCategoryRepository: Repository<MiddleCategory>,
  ) {}

  async createMajorCategory(payload: MajorCategoryPayload, userId: number): Promise<MajorCategoryResponse> {
    const majorCategory = this.majorCategoryRepository.create({
      ...payload,
      user: { id: userId },
      type: 1, // 기본값으로 지출 타입 설정 (필요에 따라 수정 가능)
    })

    const savedCategory = await this.majorCategoryRepository.save(majorCategory)

    return {
      id: savedCategory.id,
      emoji: savedCategory.emoji,
      label: savedCategory.label,
      type: savedCategory.type,
      created_date: savedCategory.created_date,
      updated_date: savedCategory.updated_date,
    }
  }

  async createMiddleCategory(payload: MiddleCategoryPayload, userId: number): Promise<MiddleCategoryResponse> {
    // majorCategory 존재 여부 확인
    const majorCategory = await this.majorCategoryRepository.findOne({
      where: { id: payload.majorCategoryId, user: { id: userId }, deleted_date: IsNull() },
    })
    if (!majorCategory) {
      throw new NotFoundException('대분류를 찾을 수 없습니다.')
    }
    const middleCategory = this.middleCategoryRepository.create({
      ...payload,
      majorCategory: { id: payload.majorCategoryId },
      user: { id: userId },
      type: 1, // 기본값: 지출(2) 또는 수입(1) 등 필요시 수정
    })
    const saved = await this.middleCategoryRepository.save(middleCategory)
    return {
      id: saved.id,
      majorCategoryId: saved.majorCategory.id,
      emoji: saved.emoji,
      label: saved.label,
      type: saved.type,
      createdDate: saved.createdDate,
      updatedDate: saved.updatedDate,
    }
  }

  async getMajorCategories(userId: number, name?: string): Promise<MajorCategoryResponse[]> {
    const queryBuilder = this.majorCategoryRepository
      .createQueryBuilder('majorCategory')
      .where('majorCategory.user.id = :userId', { userId })
      .andWhere('majorCategory.deleted_date IS NULL')

    if (name) {
      queryBuilder.andWhere('majorCategory.label LIKE :name', { name: `%${name}%` })
    }

    const categories = await queryBuilder.getMany()

    return categories.map((category) => ({
      id: category.id,
      emoji: category.emoji,
      label: category.label,
      type: category.type,
      created_date: category.created_date,
      updated_date: category.updated_date,
    }))
  }

  async updateMajorCategory(userId: number, payload: MajorCategoryUpdatePayload): Promise<MajorCategoryResponse> {
    const category = await this.majorCategoryRepository.findOne({
      where: {
        id: payload.id,
        user: { id: userId },
        deleted_date: IsNull(),
      },
    })

    if (!category) {
      throw new NotFoundException('대분류를 찾을 수 없습니다.')
    }

    // 업데이트할 필드만 설정
    if (payload.emoji !== undefined) {
      category.emoji = payload.emoji
    }
    if (payload.label !== undefined) {
      category.label = payload.label
    }

    const updatedCategory = await this.majorCategoryRepository.save(category)

    return {
      id: updatedCategory.id,
      emoji: updatedCategory.emoji,
      label: updatedCategory.label,
      type: updatedCategory.type,
      created_date: updatedCategory.created_date,
      updated_date: updatedCategory.updated_date,
    }
  }

  async deleteMajorCategory(categoryId: number, userId: number): Promise<{ message: string }> {
    const category = await this.majorCategoryRepository.findOne({
      where: {
        id: categoryId,
        user: { id: userId },
        deleted_date: IsNull(),
      },
    })

    if (!category) {
      throw new NotFoundException('대분류를 찾을 수 없습니다.')
    }

    // Soft Delete - deleted_date 설정
    await this.majorCategoryRepository.softDelete(categoryId)

    return {
      message: '대분류가 성공적으로 삭제되었습니다.',
    }
  }

  async getMiddleCategories(
    userId: number,
    name?: string,
    majorCategoryId?: number,
  ): Promise<MiddleCategoryResponse[]> {
    const queryBuilder = this.middleCategoryRepository
      .createQueryBuilder('middleCategory')
      .leftJoinAndSelect('middleCategory.majorCategory', 'majorCategory')
      .where('middleCategory.user.id = :userId', { userId })
      .andWhere('middleCategory.deletedDate IS NULL')

    if (name) {
      queryBuilder.andWhere('middleCategory.label LIKE :name', { name: `%${name}%` })
    }

    if (majorCategoryId) {
      queryBuilder.andWhere('middleCategory.majorCategory.id = :majorCategoryId', { majorCategoryId })
    }

    const categories = await queryBuilder.getMany()

    return categories.map((category) => ({
      id: category.id,
      majorCategoryId: category.majorCategory.id,
      emoji: category.emoji,
      label: category.label,
      type: category.type,
      createdDate: category.createdDate,
      updatedDate: category.updatedDate,
    }))
  }

  async updateMiddleCategory(userId: number, payload: MiddleCategoryUpdatePayload): Promise<MiddleCategoryResponse> {
    const middleCategory = await this.middleCategoryRepository.findOne({
      where: {
        id: payload.id,
        user: { id: userId },
        deletedDate: IsNull(),
      },
      relations: ['majorCategory'],
    })
    if (!middleCategory) {
      throw new NotFoundException('중분류를 찾을 수 없습니다.')
    }
    if (payload.emoji !== undefined) {
      middleCategory.emoji = payload.emoji
    }
    if (payload.label !== undefined) {
      middleCategory.label = payload.label
    }
    const updated = await this.middleCategoryRepository.save(middleCategory)
    return {
      id: updated.id,
      majorCategoryId: updated.majorCategory.id,
      emoji: updated.emoji,
      label: updated.label,
      type: updated.type,
      createdDate: updated.createdDate,
      updatedDate: updated.updatedDate,
    }
  }

  async deleteMiddleCategory(categoryId: number, userId: number): Promise<{ message: string }> {
    const category = await this.middleCategoryRepository.findOne({
      where: {
        id: categoryId,
        user: { id: userId },
        deletedDate: IsNull(), // 삭제된 데이터 제외
      },
    })

    if (!category) {
      throw new NotFoundException('중분류를 찾을 수 없습니다.')
    }

    // Soft Delete - deletedDate 설정
    await this.middleCategoryRepository.softDelete(categoryId)

    return {
      message: '중분류가 성공적으로 삭제되었습니다.',
    }
  }

  async getAllCategories(userId: number): Promise<AllCategoryResponse[]> {
    // 대분류 조회
    const majorCategories = await this.majorCategoryRepository
      .createQueryBuilder('majorCategory')
      .where('majorCategory.user.id = :userId', { userId })
      .andWhere('majorCategory.deleted_date IS NULL')
      .getMany()

    // 중분류 조회
    const middleCategories = await this.middleCategoryRepository
      .createQueryBuilder('middleCategory')
      .leftJoinAndSelect('middleCategory.majorCategory', 'majorCategory')
      .where('middleCategory.user.id = :userId', { userId })
      .andWhere('middleCategory.deletedDate IS NULL')
      .getMany()

    // 대분류를 AllCategoryResponse 형태로 변환
    const majorCategoryResponses: AllCategoryResponse[] = majorCategories.map((category) => ({
      type: 'major',
      id: category.id,
      emoji: category.emoji,
      label: category.label,
      categoryType: category.type,
      createdDate: category.created_date,
      updatedDate: category.updated_date,
    }))

    // 중분류를 AllCategoryResponse 형태로 변환
    const middleCategoryResponses: AllCategoryResponse[] = middleCategories.map((category) => ({
      type: 'middle',
      id: category.id,
      majorCategoryId: category.majorCategory.id,
      emoji: category.emoji,
      label: category.label,
      categoryType: category.type,
      createdDate: category.createdDate,
      updatedDate: category.updatedDate,
    }))

    // 대분류와 중분류를 합쳐서 반환
    return [...majorCategoryResponses, ...middleCategoryResponses]
  }
}
