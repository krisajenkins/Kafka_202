import child_process from 'child_process';
import util from 'util';
const exec = util.promisify(child_process.exec);

export type Metric = {
    metric: string;
    count: number;
}

export async function getVmStats(): Promise<Metric[]> {
    const vmStatRegex = /^"?(.*)"?: *([0-9]+)\.$/;

    const { stdout, stderr } = await exec("vm_stat");

    if (stderr) {
        console.error(stderr);
        process.exit(1);
    }

    const stats = stdout
        .split("\n")
        .map((line) => {
            const match = line.match(vmStatRegex);
            if (match) {
                return {
                    metric: match[1],
                    count: parseInt(match[2])
                };
            }
        })
        .filter((metric): metric is Metric => !!metric);

    return stats;
}
