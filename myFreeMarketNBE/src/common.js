
module.exports = {
    sleep: async function sleep(milliseconds) {
        while (milliseconds > 0) {
            const to_wait = (milliseconds > 300) ? 300 : milliseconds;
            await new Promise((resolve) => {
                setTimeout(resolve, to_wait);
            });
            milliseconds -= to_wait;
        }
    }
}