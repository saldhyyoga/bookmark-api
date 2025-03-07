export const successResponse = (data: unknown, message = "success") => {
  return {
    success: true,
    message,
    data,
  };
};
  
  export const errorResponse = (message = "something went wrong", statusCode = 500) => {
    return {
      success: false,
      message,
      statusCode,
    };
  };