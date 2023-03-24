import { DPoPHandler} from './dpop-handler';

export class NullDPoPHandler implements DPoPHandler {

    private privateKey: any = null;

    constructor() {
       this.privateKey = null;
    }
      
    getDPoPHeader(): string {
        return null;
    }    
}