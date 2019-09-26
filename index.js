const axios = require("axios");

const URL = "http://xrn-us-west-1.regen.network:26657/status";
const UPDATE_BLOCK = 1722050;
const BLOCK_INTERVAL = 5660; // in milliseconds

async function getBlockInfo(url) {
    const response = await axios.get(url);
    const sync = response.data.result.sync_info;
    return {
        height: parseInt(sync.latest_block_height),
        time: Date.parse(sync.latest_block_time)
    }
}

async function estimateUpgradeTime(url, updateBlock, blockInterval) {
    const {height, time} = await getBlockInfo(url);
    if (updateBlock <= height) {
        throw new Error("Upgrade already active");
    }
    const msLeft = (updateBlock - height) * blockInterval;
    const upgrade = new Date();
    upgrade.setTime(time + msLeft);
    return upgrade;
}



estimateUpgradeTime(URL, UPDATE_BLOCK, BLOCK_INTERVAL).
    then(x => console.log(`Upgrade at block ${UPDATE_BLOCK} will occur approximately ${x.toUTCString()}`)).
    catch(err => console.log(`Error: ${err}`))