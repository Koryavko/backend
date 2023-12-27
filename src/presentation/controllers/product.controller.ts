import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserGuard } from '../../infrastructure/rest/guards/user.guard';
import {
  AuthErrorResponse,
  ConflictErrorResponse,
  ErrorResponse,
  NotFoundResponse,
  TooManyRequestsResponse,
  UnprocessableErrorResponse,
} from '../responses/response';
import { ApiTooManyRequestsResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { SaveFavoriteProductRequest } from '../requests/products/save-favorite-product.request';
import { UserRequest } from '../../infrastructure/external/modules/express/user.request';
import { SaveProductFavoriteAction } from '../../application/products/save-product-favorite.action';

@Controller('products')
@ApiBearerAuth()
@ApiTags('products')
@UseGuards(UserGuard)
@ApiUnauthorizedResponse({ type: AuthErrorResponse, description: 'Unauthorized error' })
@ApiTooManyRequestsResponse({ type: TooManyRequestsResponse, description: 'Too many requests' })
export class ProductController {
  constructor(private readonly saveProductFavoriteAction: SaveProductFavoriteAction) {}

  @Post('favorites')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: `Product storage for tracking` })
  @ApiBody({ type: SaveFavoriteProductRequest })
  @ApiUnprocessableEntityResponse({ type: UnprocessableErrorResponse, description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Product page not found', type: NotFoundResponse })
  @ApiConflictResponse({ description: 'The product has already been added for tracking', type: ConflictErrorResponse })
  @ApiBadRequestResponse({ description: 'Error while saving product', type: ErrorResponse })
  public async saveFavorite(@Body() body: SaveFavoriteProductRequest, @Req() request: UserRequest): Promise<void> {
    return this.saveProductFavoriteAction.execute(body, request.user);
  }
}
