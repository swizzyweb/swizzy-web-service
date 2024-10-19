import tcpPortUsed from 'tcp-port-used';

export async function isPortInUse(port: number, host = '127.0.0.1'): Promise<boolean> {
	return await tcpPortUsed.check(port, host);
}


