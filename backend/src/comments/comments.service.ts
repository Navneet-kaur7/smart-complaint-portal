import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    // First check if the complaint exists
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: createCommentDto.complaintId },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        complaintId: createCommentDto.complaintId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        complaint: {
          select: {
            id: true,
            title: true,
            consumerId: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
          complaint: {
            select: {
              id: true,
              title: true,
              consumerId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count(),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByComplaintId(complaintId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { complaintId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({ where: { complaintId } }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          complaint: {
            select: {
              id: true,
              title: true,
              consumerId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({ where: { userId } }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        complaint: {
          select: {
            id: true,
            title: true,
            consumerId: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number, userRole: string) {
    const comment = await this.findOne(id);

    // Only the user who created the comment can update it
    if (comment.userId !== userId && userRole !== 'REVIEWER') {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
        complaint: {
          select: {
            id: true,
            title: true,
            consumerId: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const comment = await this.findOne(id);

    // Only the user who created the comment can delete it, or reviewers can delete any comment
    if (comment.userId !== userId && userRole !== 'REVIEWER') {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}