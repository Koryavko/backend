import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserGuard } from '../../infrastructure/rest/guards/user.guard';
import {
  AuthErrorResponse,
  ConflictErrorResponse,
  NotFoundResponse,
  TooManyRequestsResponse,
} from '../responses/response';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { SyncRequest } from '../requests/sync/sync.request';
import { SyncSheetAction } from '../../application/sync/sync-sheet.action';

@Controller('sync')
@ApiBearerAuth()
@ApiTags('sync')
@UseGuards(UserGuard)
@ApiUnauthorizedResponse({ type: AuthErrorResponse, description: 'Unauthorized error' })
@ApiTooManyRequestsResponse({ type: TooManyRequestsResponse, description: 'Too many requests' })
export class SyncController {
  constructor(private readonly syncSheetAction: SyncSheetAction) {}

  @Post(':list')
  @ApiOperation({ summary: `Getting a list of popular domains` })
  @ApiNoContentResponse({ description: 'Table synchronization is running' })
  @ApiNotFoundResponse({ description: 'List not found', type: NotFoundResponse })
  @ApiConflictResponse({ description: 'Table during synchronisation', type: ConflictErrorResponse })
  public async sync(@Param() params: SyncRequest): Promise<void> {
    return this.syncSheetAction.execute(params.list);
  }
}
