import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FarmService } from './farm.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SWAGGER_AUTH_NAME } from 'src/common/constants/swagger.constant';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user.type';
import { FarmRoleGuard } from 'src/common/guards/farm-role.guard';
import { FarmRoles } from 'src/common/decorators/farm-roles.decorator';
import { FARM_ROLES } from 'src/common/constants/roles.constant';
import { FarmDetailsDto } from './dto/farm-details.dto';
import { CreateFarmDto } from './dto/create-farm.dto';

@ApiTags('Farm')
@Controller({
    path: 'farm',
    version: '1'
})
export class FarmController {
    constructor(private readonly farmService: FarmService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth(SWAGGER_AUTH_NAME)
    @ApiOperation({
        summary: 'Get my farms'
    })
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.farmService.findAll(user.id);
    }

    @Get(':farmId')
    @UseGuards(JwtAuthGuard, FarmRoleGuard)
    @FarmRoles(
        FARM_ROLES.OWNER,
        FARM_ROLES.MANAGER,
        FARM_ROLES.OPERATOR,
        FARM_ROLES.VIEWER
    )
    findOne(@Param('farmId') farmId: string) {
        return this.farmService.findOne(farmId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth(SWAGGER_AUTH_NAME)
    @ApiOperation({
        summary: 'Create new farm'
    })
    @ApiCreatedResponse({
        type: FarmDetailsDto
    })
    create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateFarmDto) {
        return this.farmService.create(user.id, dto);
    }
}
