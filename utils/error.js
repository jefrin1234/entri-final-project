const handleError = async (error, req, res, next) => {    //error is received from the controller 
  //send the  error that is got from the  catch blockm in the error  controlller 
  try {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong, please try again";


    res.status(statusCode).json({ message });

  }
  // if the error is  not sending properly then this catch block runs and sends  a common error
  catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = { handleError };