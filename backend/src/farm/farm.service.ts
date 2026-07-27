import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmMapper } from './mappers/farm.mapper';

@Injectable()
export class FarmService {
    constructor(private readonly prisma: PrismaService) {}

    private async getOwnerRole() {
        const role = await this.prisma.role.findUnique({
            where: {
                code: 'OWNER'
            }
        });

        if(!role) {
            throw new InternalServerErrorException('Owner role not found.');
        }

        return role;
    }

    async create(userId: string, dto: CreateFarmDto) {
        const ownerRole = await this.getOwnerRole();

        return this.prisma.$transaction(async (tx) => {
            const farm = await tx.farm.create({
                data: {
                    ...dto,
                    createdById: userId
                }
            });

            await tx.farmMember.create({
                data: {
                    farmId: farm.id,
                    userId,
                    roleId: ownerRole.id,
                    status: 'ACTIVE',
                    joinedAt: new Date()
                }
            });

            return FarmMapper.toResponse(farm);
        })
    }
}
