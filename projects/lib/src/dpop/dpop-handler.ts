export abstract class DPoPHandler {    

    public abstract getDPoPHeader(
      httpMethod:string,
      httpUri:string
      ): string;
   
}