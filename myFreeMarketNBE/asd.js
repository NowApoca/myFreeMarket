async function confirmateTxOnServer(i, asdArray) {
        if(i == 3 || i == 2){
            asdArray.push(i)
            return;
        }
        return;
    }
    
    async function test() {
      let i;
      const promises = [];
      const failedConfirmations = [];
      
      for (i = 0; i < 5; ++i) {
        // promises.push(doSomethingAsync(i, asdArray));
          promises.push(confirmateTxOnServer(i, failedConfirmations));
      }

        const a = await Promise.all(promises)
        console.log(failedConfirmations)
    }
    
    test();