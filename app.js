document.addEventListener('DOMContentLoaded',()=>{
    const outputLog = document.getElementById('outputLog');
    const userInput = document.getElementById('userInput');
    const bootSequence = [
        "INITIALIZING Null Ritual v1.0.0...",
        "ESTABLISHING SECURE HANDSHAKE WITH UNKNOWN NODE...",
        "WARNING: Session monitored by unauthorized entity.",
        "--------------------------------------------------",
        "Type 'BEGIN' to initiate the connection, or 'HELP' for instructions."
    ];
    function printToLog(text, className = ''){
        const line = document.createElement('div');
        line.textContent = text;
        if (className) line.className = className;
        outputLog.appendChild(line);
        outputLog.scrollTop = outputLog.scrollHeight;
    }
    let delay = 200;
    bootSequence.forEach((line, index) =>{
        setTimeout(()=>{
            printToLog(line);
        },delay * index);
    });
    userInput.addEventListener('keydown',(e)=>{
        if (e.key === 'Enter'){
            const command = userInput.value.trim();
            if (!command) return;
            printToLog(`> #{command}`, 'user-command');
            userInput.value = '';
            handleCommand(command.toUpperCase());
        }
    });
    function handleCommand(cmd){
        switch(cmd){
            case 'BEGIN':
                printToLog("CONNECTION ACCEPTED. The circle is drawn. State your name.");
                break;
            case 'HELP':
                printToLog("Available commands: BEGIN, EXIT, STATUS");
                break;
            case 'STATUS':
                printToLog("ENTITY PROXIMITY: 42% -- SIGNAL UNSTABLE,");
                break;
            default:
                printToLog(`Command not recognized: "${cmd}". The entity grows impatient.`);
        }
    }
    document.addEventListener('click',()=>{
        userInput.focus();
    });
});