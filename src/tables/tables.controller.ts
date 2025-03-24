import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { TablesService } from './tables.service';
import { Roles } from '../common/roles/roles.decorator';
import { RolesGuard } from '../common/roles/roles.guard';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  // Only Managers Can Assign Tables
  @Post('assign')
  @Roles('manager') // Apply role decorator
  @UseGuards(RolesGuard) // Apply guard
  async assignTable(@Body() data: { waiterId: number; tableNumber: string }) {
    return this.tablesService.assignTable(data.waiterId, data.tableNumber);
  }

  // Waiters Can View Only Their Assigned Tables
  @Get('my-tables')
  @Roles('waiter')
  @UseGuards(RolesGuard)
  async getMyTables(@Req() req) {
    const userId = req.user.id; // Extract user ID from token
    return this.tablesService.getAssignedTables(userId);
  }
}
