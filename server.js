// server.js (Node.js proxy)
const express = require('express');
const snmp = require('net-snmp');
const cors = require('cors');

const app = express();
app.use(cors());

const AGENT_IP = '192.168.1.1'; // IP de tu antena
const COMMUNITY = 'public';

app.get('/api/snmp', async (req, res) => {
    try {
        const oids = [
            '1.3.6.1.2.1.1.3.0', // sysUpTime
            '1.3.6.1.4.1.41112.1.4.5.1.2.1', // Señal RSSI (Ubiquiti específico)
            '1.3.6.1.2.1.2.2.1.10.1', // Tráfico de entrada
            '1.3.6.1.2.1.2.2.1.16.1'  // Tráfico de salida
        ];

        const session = snmp.createSession(AGENT_IP, COMMUNITY);
        
        session.get(oids, (error, varbinds) => {
            if (error) {
                res.status(500).json({ error: error.toString() });
            } else {
                const data = {
                    uptime: varbinds[0].value,
                    signal: varbinds[1].value,
                    trafficIn: varbinds[2].value,
                    trafficOut: varbinds[3].value
                };
                res.json(data);
            }
            session.close();
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(3000, () => {
    console.log('Proxy SNMP ejecutándose en puerto 3000');
});
