//import ethers.js
const { ethers } = require("hardhat")

//create main function

async function main(){
    //create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract is deploying")
    //deploy contract from factory
    const fundMe = await fundMeFactory.deploy(300)
    await fundMe.waitForDeployment()
    console.log("contract has been deployed successfully, contracts address is " + fundMe.target)
    //或者另外一种写法
//   console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)
    
    //verify fundme
    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
            console.log("Waiting for 3 confirmations")
            await fundMe.deploymentTransaction().wait(3)
            await verifyFundMe(fundMe.target,[300])
    }else{
        console.log("verification skipped...")
    }

     //init 2 accounts
     const [firstAccount, secondAccount]= await ethers.getSigners()
     //fund contract with first accout
     const fundTx = await fundMe.fund({value: ethers.parseEther("0.003")})
     await fundTx.wait()

     //check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContract}`)


     //fund contract with second account
     const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.003")})
     await fundTxWithSecondAccount.wait()
     //check balance of contact
     const balanceOfContractAfterSecondAccount = await ethers.provider.getBalance(fundMe.target)
     console.log(`Balance of the contract is ${balanceOfContractAfterSecondAccount}`)
     //check mapping fundersToAmout
     const firstAccountbalanceInFundME = await fundMe.fundersToAmount(firstAccount.address)
     const secondAccountbalanceInFundME = await fundMe.fundersToAmount(secondAccount.address)
     console.log(`Balance of the first account is ${firstAccount.address} is ${firstAccountbalanceInFundME}`)
     console.log(`Balance of the second account is ${secondAccount.address} is ${secondAccountbalanceInFundME}`)
}

async function verifyFundMe(fundMeAddr, args){
    await hre.run("verify:verify",{
        address: fundMeAddr,
        constructorArguments:args,
    });
}
//execute main function
main().then().catch((error)=>{
    console.error(error)
    process.exit(1)
})