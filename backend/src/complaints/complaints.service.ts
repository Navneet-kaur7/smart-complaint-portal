import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { ComplaintStatus } from '@prisma/client';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(createComplaintDto: CreateComplaintDto, consumerId: number) {
    return this.prisma.complaint.create({
      data: {
        ...createComplaintDto,
        consumerId,
        status: ComplaintStatus.PENDING,
      },
      include: {
        consumer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        comments: {
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
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [complaints, total] = await Promise.all([
      this.prisma.complaint.findMany({
        skip,
        take: limit,
        include: {
          consumer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          comments: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.complaint.count(),
    ]);

    return {
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByConsumerId(consumerId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [complaints, total] = await Promise.all([
      this.prisma.complaint.findMany({
        where: { consumerId },
        skip,
        take: limit,
        include: {
          consumer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          comments: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.complaint.count({ where: { consumerId } }),
    ]);

    return {
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        consumer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        comments: {
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
        },
      },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }

  async update(id: number, updateComplaintDto: UpdateComplaintDto, userId: number, userRole: string) {
    const complaint = await this.findOne(id);

    // Only the consumer who created the complaint can update it (except status)
    // Only reviewers can update status
    if (updateComplaintDto.status && userRole !== 'REVIEWER') {
      throw new ForbiddenException('Only reviewers can update complaint status');
    }

    if (userRole === 'CONSUMER' && complaint.consumerId !== userId) {
      throw new ForbiddenException('You can only update your own complaints');
    }

    return this.prisma.complaint.update({
      where: { id },
      data: updateComplaintDto,
      include: {
        consumer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        comments: {
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
        },
      },
    });
  }

  async remove(id: number, userId: number, userRole: string) {
    const complaint = await this.findOne(id);

    // Only the consumer who created the complaint can delete it
    if (userRole === 'CONSUMER' && complaint.consumerId !== userId) {
      throw new ForbiddenException('You can only delete your own complaints');
    }

    // Reviewers can delete any complaint
    if (userRole !== 'REVIEWER' && userRole !== 'CONSUMER') {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.complaint.delete({
      where: { id },
    });
  }

  async getComplaintStats() {
    const [total, pending, inProgress, resolved] = await Promise.all([
      this.prisma.complaint.count(),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.PENDING } }),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.IN_PROGRESS } }),
      this.prisma.complaint.count({ where: { status: ComplaintStatus.RESOLVED } }),
    ]);

    return {
      total,
      pending,
      inProgress,
      resolved,
    };
  }
}