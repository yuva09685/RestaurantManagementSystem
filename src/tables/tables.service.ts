import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { db } from '../db/index';
import { tablesTable } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TablesService {
  async assignTable(waiterId: number, tableNumber: string) {
    try {
      await db.insert(tablesTable).values({
        waiterId,
        tableNumber,
      });
      return { message: `Table ${tableNumber} assigned to Waiter ${waiterId}` };
    } catch (error) {
      throw new InternalServerErrorException('Error assigning table: ' + error.message);
    }
  }

  async getAssignedTables(waiterId: number) {
    try {
      const tables = await db.select().from(tablesTable).where(eq(tablesTable.waiterId, waiterId));
      return tables;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching assigned tables: ' + error.message);
    }
  }
}
