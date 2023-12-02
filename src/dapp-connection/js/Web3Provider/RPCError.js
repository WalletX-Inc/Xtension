class RPCError {
  constructor(message, code = 4200, method = "Unsupported Method") {
    return Promise.reject({
      message,
      code,
      method,
    });
  }
}

export default RPCError;
