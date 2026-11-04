document.addEventListener('DOMContentLoaded',()=>{
    const outputLog = document.getElementById('outputLog');
    const userInput = document.getElementById('userInput');
    const bodyElement = document.body;
    let ritualState = 0;
    let userName = "";
    let corruptionIntensity = 0;
    let titleInterval = null;
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
            printToLog(`> ${rawCommand}`, 'user-command');
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
        if(checkEasterEggs(cmd, ritualState)){
            return;
        }
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
                    printToLog("ENTITY: Can you hear it scratching behind the monitor, " + userName + "? (YES/NO)");
                }, 800);
                break;
            case 2:
                if (upperCmd === 'YES' || upperCmd === 'NO'){
                    printToLog(`You answered: ${upperCmd}. A grave mistake.`);
                    ritualState = 3;
                    corruptionIntensity = 2;
                    triggerHeavyGlitch();
                    startTitleGlitch();
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
            bodyElement.classList.remove('glitch-active');
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
    function checkEasterEggs(cmd,currentPhase){
        const upperCmd = cmd.toUpperCase();
        switch(upperCmd){
            case 'WHOIS':
                if (currentPhase <2){
                    printToLog("TARGET: LOCAL_USER | IP: [REDACTED] | STATUS: UNBOUND")
                } else{
                    printToLog("TARGET: " + (userName || "VESSEL")+" | STATUS: BOUND | PROXIMITY: CRITICAL");
                }
                return true;
            case 'LOGS':
            case 'HISTORY':
                printToLog("--- SYSTEM INCIDENT LOG ---");
                printToLog("[03:14:00] NODE_CREATED");
                printToLog("[03:14:12] CONTAINMENT_BREACH_DETECTED");
                if (currentPhase >=2){
                    printToLog("[03:15:02] THREAT_NAME: " + (userName || "UNKNOWN"));
                    printToLog("[03:15:44] A̶D̶V̶I̶S̶O̶R̶Y̶:̶ ̶D̶O̶ ̶N̶O̶T̶ ̶A̶N̶S̶W̶E̶R̶");
                }
                return true;
            case 'HELP':
                if (currentPhase === 0){
                    printToLog("AVAILABLE COMMANDS: BEGIN, HELP, WHOIS");
                } else if (currentPhase === 1){
                    printToLog("ENTER YOUR NAME TO ANCHOR THE SESSION");
                } else if (currentPhase === 2){
                    printToLog("ANSWER THE QUESTION. YES OR NO.");
                } else{
                    printToLog("H E L P    I S    N O T    C O M I N G");
                }
                return true;
            case 'CLEAR':
            case 'CLS':
                printToLog("THE TERMINAL REFUSES TO FORGET");
                return true;
            default:
                return false;
        }
    }
    document.addEventListener('click',()=>{
        userInput.focus();
    });
    function startTitleGlitch(userName = "VESSEL"){
        if (titleInterval) return;
        const spookyTitles = [
            "⚠️ IT SEE U",
            "👀 DON'T LOOK AWAY",
            `🔓 TARGET LOCKED: ${userName}`,
            "H E L P   Y O U R S E L F"
        ];
        let index = 0;
        titleInterval = setInterval(()=>{
            document.title = spookyTitles[index];
            index = (index + 1) % spookyTitles.length;
        }, 2500);
    }
    function resetTabTitle(){
        if (titleInterval) clearInterval(titleInterval);
        document.title = "THE RITUAL OF UNSEEING";
    }
});