interface customErrorInterface {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

export class customError extends Error{
   
}