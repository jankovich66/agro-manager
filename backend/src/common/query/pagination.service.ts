import { Injectable } from "@nestjs/common";
import { PaginationResultDto } from "./dto/pagination-result.dto";

@Injectable()
export class PaginationService {
    paginate<T>(data: T[], total: number, page: number, limit: number): PaginationResultDto<T> {
        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        }
    }
}