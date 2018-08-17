const SC_ABI = require('../assets/BETSmartContractABI.json')
const TOKEN_ABI = require('../assets/BETTokenABI.json')

export async function callSc(name, ...args) {
    const contract = window.web3.eth.contract(SC_ABI).at(process.env.REACT_APP_SC_ADDRESS)
    const result = new Promise((resolve, reject) => {
        contract[name](...args, (err, result) => {
            if (!err) resolve(result)
            else reject(err)
        })
    })

    return await result
}

export async function callTokenSc(name, ...args) {
    const contract = window.web3.eth.contract(TOKEN_ABI).at(process.env.REACT_APP_TOKEN_ADDRESS)
    const result = new Promise((resolve, reject) => {
        contract[name](...args, (err, result) => {
            if (!err) resolve(result)
            else reject(err)
        })
    })

    return await result
}

export function getScData(name, ...args) {
    const contract = window.web3.eth.contract(SC_ABI).at(process.env.REACT_APP_SC_ADDRESS)
    return contract[name].getData(...args)
}