import { Request } from './request';
import { Position } from './position';

export class Permission {

    id: number;
    request: Request;
    position: Position;
    create: boolean;
    read: boolean;
    permission: string;

    constructor() {

    }
}
