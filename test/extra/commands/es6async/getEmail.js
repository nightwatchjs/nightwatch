module.exports = class GetEmailBody {
  async command(type) {
    let returnValue;

    switch(type){
      case 1:
        try {
          returnValue = await getEmail();
        } catch (err) {
          returnValue = {
            status: -1,
            error: err.message
          }
        }
    
        return returnValue;

      case 2:
        try {
          returnValue = await getEmail();
        } catch (err) {
          returnValue = {
            status: -1,
            error: err
          }
        }
    
        return returnValue;

      case 3:
        return await getEmail();
    }
  }
}

const getEmail = () => new Promise((resolve, reject) => {
  reject(new Error('Email not found'));
});