document.addEventListener('DOMContentLoaded',()=>{
    const outputLog = document.getElementById('outputLog');
    const userInput = document.getElementById('userInput');
    const bodyElement = document.body;
    let ritualState = 0;
    let userName = "";
    let corruptionIntensity = 0;
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
            const rawCommand = userInput.value.trim();
            if (!rawCommand && ritualState !== 2) return;
            printToLog(`> #{rawCommand}`, 'user-command');
            userInput.value = '';
            ProcessRitualState(rawCommand);
        }
    });
    userInput.addEventListener('input', (e) => {
        if (corruptionIntensity > 1 && Math.random() < 0.3){
            const glitchChars = ['#', '$', 'X','Ø','0', '_','?'];
            const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            userInput.value += randomChar;
        }
    });
    function ProcessRitualState(cmd){
        const upperCmd = cmd.toUpperCase();
        switch(ritualState){
            case 0:
                if (upperCmd === 'BEGIN'){
                    ritualState = 1;
                    printToLog("CONNECTION ACCEPTED. The perimeter is sealed.");
                    setTimeout(()=>{
                        printToLog("State your true name to anchor your soul to this terminal:");
                    }, 500);
                } else{
                    printToLog(`Command "${upperCmd}" rejected. Type 'BEGIN' to proceed.`);
                }
                break;
            case 1:
                userName = cmd;
                ritualState = 2;
                corruptionIntensity = 1;
                printToLog(`ANCHOR LOCKED: ${userName}.`);
                triggerVisualGlitch();
                setTimeout(()=>{
                    printToLog("-------------------------------------");
                    printToLog("ENTITY: Can you hear it scratching behind the monitor," + userName + "? {YES/NO)");
                }, 800);
                break;
            case 2:
                if (upperCmd === 'YES' || upperCmd === 'NO'){
                    printToLog(`You answered: ${upperCmd}. A grave mistake.`);
                    ritualState = 3;
                    corruptionIntensity = 2;
                    triggerHeavyGlitch();
                    setTimeout(()=>{
                        printToLog("-------------------------------------");
                        printToLog("WARNING: CONTAINMENT PROTOCOL FAILED");
                        printToLog("THE ENTITY IS INSIDE THE LOCAL DOM");
                        printToLog("Type 'PURGE' to attempt emergency abort");
                    }, 1000);
                } else {
                    printToLog("The entity demands a binary answer: YES or NO");
                }
                break;
            case 3:
                if (upperCmd === 'PURGE'){
                    printToLog("PURGE FAILED. ACCESS DENIED");
                    triggerCriticalFailure();
                } else {
                    printToLog(`"${upperCmd}" is meaningless now. There is no escape, ${userName}.`);
                    triggerVisualGlitch();
                }
                break;
        }
    }
    function triggerVisualGlitch(){
        bodyElement.classList.add('glitch-active');
        setTimeout(()=>{
            bodyElement.classList.add('glitch-active');
        }, 300);
    }
    function triggerHeavyGlitch(){
        bodyElement.classList.add('glitch-active');
        setInterval(()=>{
            if(Math.random()>0.6){
                bodyElement.classList.toggle('glitch-active');
            }
        }, 1500);
    }
    function triggerCriticalFailure(){
        bodyElement.style.backgroundColor = '#200000';
        userInput.disabled = true;
        userInput.placeholder = "TERMINAL COMPROMISED";

        let glitchMessages = [
            "I T    I S    A L R E A D Y    H E R E",
            "01010011 01010101 010100011 01000101",
            "LOOK BEHIND U",
            "NULL_RITUAL COMPLETE"
        ];
        glitchMessages.forEach((msg, idx) =>{
            setTimeout(()=>{
                printToLog(msg, 'critical-error');
            }, (idx+1)*800);
        });
    }
    document.addEventListener('click',()=>{
        userInput.focus();
    });
});