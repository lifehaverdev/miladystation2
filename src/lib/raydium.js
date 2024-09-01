const computeCost = {
    "A100": 0.0008,
    "L4": 0.000321
}

//using price of sol, and cost of compute, calculate how many points someone can buy
async function getPremiumPoints(float) {
    const solPrice = await fetch('https://api-v3.raydium.io/mint/price?mints=So11111111111111111111111111111111111111112')
        if(solPrice.ok){
            const solData = await solPrice.json()
            const solPriceUsd = parseFloat(solData.data['So11111111111111111111111111111111111111112'])
            console.log('solpriceusd',solPriceUsd)
            points = float * solPriceUsd / (2 * computeCost["L4"]) //sol*usd/sol / usd/sec == sec
            console.log('points',points)
            //console.log('pointgen',points / 30)
            //console.log(Math.cbrt(points))
            //console.log('markup',(amount*solPriceUsd)/(computeCost * points)) //usd/sec * sec) / sol*usd/sol) == usd / usd
        } else {
            throw Error('no response from raydium')
        }
        return points;
}

//get how many ms2 need to burn worth $250
async function getMS2Equiv() {
    //const amount = 1
    const raydiumResponse = await fetch('https://api-v3.raydium.io/pools/info/mint?mint1=AbktLHcNzEoZc9qfVgNaQhJbqDTEmLwsARY7JcTndsPg&poolType=all&poolSortField=default&sortType=desc&pageSize=1&page=1')
    const solPriceResponse = await fetch('https://api-v3.raydium.io/mint/price?mints=So11111111111111111111111111111111111111112')
        if(raydiumResponse.ok && solPriceResponse.ok){
            const data = await raydiumResponse.json()
            const solData = await solPriceResponse.json()
            const price = 0.99 / data.data.data[0].price
            //const computeCost = 0.000321
            const solPrice = parseFloat(solData.data['So11111111111111111111111111111111111111112'])
            //console.log('ms2 price',price,'sol price',solPrice);
            const ms2Amount = 250 / solPrice / price //amount / price;
            return ms2Amount;
        } else {
            throw Error('no response from raydium')
        }
        
}

module.exports = {
    getPremiumPoints,
    getMS2Equiv
}