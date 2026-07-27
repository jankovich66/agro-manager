import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { FarmMapper } from './mappers/farm.mapper';
import { FarmListItemDto } from './dto/farm-list-item.dto';

@Injectable()
export class FarmService {
    constructor(private readonly prisma: PrismaService) {}
    
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

            return FarmMapper.toDetailsDto(farm);
        })
    }

    async findAll(userId: string): Promise<FarmListItemDto[]> {
        const farms = await this.prisma.farm.findMany({
            where: {
                deletedAt: null,
                members: {
                    some: {
                        userId,
                        status: 'ACTIVE'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return farms.map(farm => FarmMapper.toListDto(farm));
    }

    async findOne(farmId: string) {
        const farm = await this.prisma.farm.findFirst({
            where: {
                id: farmId,
                deletedAt: null
            }
        });

        if(!farm) {
            throw new NotFoundException('Farm not found.');
        }

        return FarmMapper.toDetailsDto(farm);
    }

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
}
