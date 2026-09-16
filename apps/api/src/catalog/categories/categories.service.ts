import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { generateUniqueSlug } from '../utils/slug.util.js';
import type { CreateCategoryDto } from './dto/create-category.dto.js';
import type { UpdateCategoryDto } from './dto/update-category.dto.js';

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  children: CategoryTreeNode[];
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create category — slug generated once at creation time using nanoid collision handler.
   */
  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parentExists = await this.prisma.category.findFirst({
        where: { id: dto.parentId, deletedAt: null },
      });
      if (!parentExists) {
        throw new NotFoundException(`Parent category with ID ${dto.parentId} not found`);
      }
    }

    const slug = await generateUniqueSlug(dto.name, async (candidate) => {
      const found = await this.prisma.category.findUnique({ where: { slug: candidate } });
      return !!found;
    });

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        parentId: dto.parentId,
      },
    });
  }

  /**
   * Return full hierarchical tree of all active categories in a single call.
   */
  async getTree(): Promise<CategoryTreeNode[]> {
    const all = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    const categoryMap = new Map<string, CategoryTreeNode>();
    all.forEach((cat) => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentId: cat.parentId,
        createdAt: cat.createdAt,
        children: [],
      });
    });

    const rootNodes: CategoryTreeNode[] = [];

    categoryMap.forEach((node) => {
      if (node.parentId && categoryMap.has(node.parentId)) {
        categoryMap.get(node.parentId)!.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  }

  /**
   * Update category fields (does not alter slug).
   */
  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (dto.parentId !== undefined && dto.parentId !== null) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }
      const parentExists = await this.prisma.category.findFirst({
        where: { id: dto.parentId, deletedAt: null },
      });
      if (!parentExists) {
        throw new NotFoundException(`Parent category with ID ${dto.parentId} not found`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId,
      },
    });
  }

  /**
   * Delete category — BLOCKS deletion if category has children or attached products.
   */
  async delete(id: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: {
            children: { where: { deletedAt: null } },
            products: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category._count.children > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it has ${category._count.children} child categories. Delete or re-parent child categories first.`,
      );
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because it contains ${category._count.products} products. Move products to another category first.`,
      );
    }

    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
