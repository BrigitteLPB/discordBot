import { LOG, logUtil } from "src/Constants";
import * as fs from 'fs'

fs.mkdir(LOG.PATH, () => {
	logUtil.logInfo("hello world !");
});
