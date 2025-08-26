const {task} = require("hardhat/config")

task("deploy-fundme").setAction(async(TASK_COMPILE_GET_REMAPPINGS,hre) =>{
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract is deploying")
    //deploy contract from factory
    const fundMe = await fundMeFactory.deploy(300)
    await fundMe.waitForDeployment()
    console.log("contract has been deployed successfully, contracts address is " + fundMe.target)
    //或者另外一种写法
    //console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)
    
    //verify fundme
    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
            console.log("Waiting for 3 confirmations")
            await fundMe.deploymentTransaction().wait(3)
            await verifyFundMe(fundMe.target,[300])
    }else{
        console.log("verification skipped...")
    }


})

async function verifyFundMe(fundMeAddr, args){
    await hre.run("verify:verify",{
        address: fundMeAddr,
        constructorArguments:args,
    });
}