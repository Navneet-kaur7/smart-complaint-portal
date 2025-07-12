import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @Roles('CONSUMER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createComplaintDto: CreateComplaintDto, @Request() req) {
    return this.complaintsService.create(createComplaintDto, req.user.userId);
  }

  @Get()
  @Roles('REVIEWER')
  @UseGuards(RolesGuard)
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.complaintsService.findAll(page, limit);
  }

  @Get('my-complaints')
  @Roles('CONSUMER')
  @UseGuards(RolesGuard)
  findMyComplaints(
    @Request() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.complaintsService.findByConsumerId(req.user.userId, page, limit);
  }

  @Get('stats')
  @Roles('REVIEWER')
  @UseGuards(RolesGuard)
  getStats() {
    return this.complaintsService.getComplaintStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Both consumers and reviewers can view complaint details
    // But we'll add authorization logic in the service if needed
    return this.complaintsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComplaintDto: UpdateComplaintDto,
    @Request() req,
  ) {
    return this.complaintsService.update(
      id,
      updateComplaintDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.complaintsService.remove(id, req.user.userId, req.user.role);
  }
}