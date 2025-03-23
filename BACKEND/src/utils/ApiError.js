class ApiError extends Error{

    constructor(statusCode,message="Something went wrong",error=[],stack)
    {
        super(message),
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.errors = error

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            data: this.data,
            success: this.success,
            errors: this.errors,
            message: this.message // Ensure message is included in JSON response
        };
    }

}

export {ApiError}