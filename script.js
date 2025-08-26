// script.js
async function getSNMPData() {
    try {
        const response = await fetch('http://localhost:3000/api/snmp');
        const data = await response.json();
        
        document.getElementById('status-text').textContent = 'Conectado';
        document.getElementById('signal-strength').textContent = data.signal;
        document.getElementById('uptime').textContent = formatUptime(data.uptime);
        document.getElementById('traffic').textContent = 
            `${(data.trafficIn / 1024 / 1024).toFixed(2)} MB`;
            
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('status-text').textContent = 'Error de conexión';
    }
}

function formatUptime(ticks) {
    const seconds = ticks / 100;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
}

// Actualizar automáticamente cada 30 segundos
setInterval(getSNMPData, 30000);
getSNMPData(); // Primera llamada
