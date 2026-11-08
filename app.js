document.addEventListener('DOMContentLoaded',()=>{
    const outputLog = document.getElementById('outputLog');
    const userInput = document.getElementById('userInput');
    const bodyElement = document.body;
    let ritualState = parseInt(localStorage.getItem('nullRitualState')) || 0;
    let userName = localStorage.getItem('nullRitualUser') ||"";
    let corruptionIntensity = ritualState > 1 ? 2:(ritualState === 1?1:0);
    let titleInterval = null;
    let commandHistory = [];
    let historyIndex = -1;
    let idleTimer = null;
    let audioCtx = null;
    let subBassOsc = null;
    let subBassGain = null;
    let staticNode = null;
    let staticGain = null;
    const IDLE_TIMEOUT = 20000;
    let lastKeystrokeTime = 0;
    let rapidKeystrokeCount = 0;
    let typingDecayTimer = null;
    let networkInfiltrationTimer = null;
    let selfDestructTimer = null;
    let timeRemaining = 60;
    let ghostTypingTimer = null;
    const bootSequence = [];
    let totalResets = parseInt(localStorage.getItem('nullRitualResets'))||0;
    let pastNamesList = JSON.parse(localStorage.getItem('nullRitualHistoryNames')) || [];
    if (ritualState > 0){
        startAmbientAudio();
        updateAudioIntensity(corruptionIntensity);
        startNetworkInfiltration();
        bootSequence.push(
            `YOU CAME BACK, ${userName || 'VESSEL'}. YOU CANNOT UNDRAW THE CIRCLE`,
            "--------------------------------------------------"
        );
        if (ritualState === 3){
            bootSequence.push("CONTAINMENT ALREADY BREACHED");
            bootSequence.push("Type 'PURGE' to attempt emergency abort");
            startTitleGlitch(userName);
            triggerHeavyGlitch();
            setTimeout(()=>{
                startSelfDestructCountdown();
            }, 1000);
        } else if(ritualState === 2){
            bootSequence.push(`RESUMING SESSION...`);
            bootSequence.push(`ENTITY: Can you hear it scratching behind the monitor, ${userName || 'VESSEL'}? (YES/NO)`);
        } else if(ritualState === 1){
            bootSequence.push(`RESUMING SESSION...`);
            bootSequence.push("State your true name to anchor your soul to this terminal:");
        }
    } else {
        if (totalResets > 0){
            bootSequence.push(
                `WARNING: STORAGE CORRUPTION DETECTED. ITERATION #${totalResets + 1}`,
                `ENTITY: I remember your previous attempts...`
            );
            if (pastNamesList.length > 0){
                bootSequence.push(`ENTITY: You tried to hide from me as '${pastNamesList[pastNamesList.length-1]}'. It didn't work then either.`);
            }
            bootSequence.push("-----------------------------------------");
        } else {
            bootSequence.push(
            "INITIALIZING Null Ritual...",
            "ESTABLISHING SECURE HANDSHAKE WITH UNKNOWN NODE...",
            "WARNING: Session monitored by unauthorized entity.",
            "--------------------------------------------------",
            );
        }
        bootSequence.push("Type 'BEGIN' to initiate the connection, or 'HELP' for instructions");
    }
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
    userInput.addEventListener('input', (e) => {
        resetIdleTimer();
        resetTypingDecay();
        clearTimeout(ghostTypingTimer);
        if (corruptionIntensity > 1 && Math.random() < 0.3){
            const glitchChars = ['#', '$', 'X','Ø','0', '_','?'];
            const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            userInput.value += randomChar;
        }
        if (ritualState >=2 && userInput.value.length > 3){
            ghostTypingTimer = setTimeout(()=>{
                injectGhostEcho();
            }, 1800);
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
                    localStorage.setItem('nullRitualState',ritualState);
                    resetIdleTimer();
                    startNetworkInfiltration();
                    updateAudioIntensity(1);
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
                localStorage.setItem('nullRitualState',ritualState);
                localStorage.setItem('nullRitualUser',userName);
                resetIdleTimer();
                printToLog(`ANCHOR LOCKED: ${userName}.`);
                triggerVisualGlitch();
                setTimeout(()=>{
                    triggerMicInfiltration();
                }, 500);
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
                    localStorage.setItem('nullRitualState',ritualState);
                    updateAudioIntensity(2);
                    triggerHeavyGlitch();
                    startTitleGlitch();
                    setTimeout(()=>{
                        triggerWebcamInfiltration();
                    }, 1000);
                    setTimeout(()=>{
                        startSelfDestructCountdown();
                    }, 1800);
                    setTimeout(()=>{
                        triggerEntityMimicry();
                    }, 3000);
                    setTimeout(()=>{
                        printToLog("-------------------------------------");
                        printToLog("WARNING: CONTAINMENT PROTOCOL FAILED");
                        printToLog("THE ENTITY IS INSIDE THE LOCAL DOM");
                        printToLog("Type 'PURGE' to attempt emergency abort");
                    }, 4500);
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
        setTimeout(()=>{
            window.alert("⚠️ WINDOWS SECURITY EXCEPTION: Unauthorized remote handshake detected from unknown node.");
        }, 400);
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
        setTimeout(()=>{
            const crashOverlay = document.getElementById('crashOverlay');
            if (crashOverlay){
                crashOverlay.classList.add('active');
            }
        }, 4500);
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
            case 'RESET':
                let resets = parseInt(localStorage.getItem('nullRitualResets'))||0;
                resets++;
                let pastNames = JSON.parse(localStorage.getItem('nullRitualHistoryNames'))|| [];
                if (userName && !pastNames.includes(userName)){
                    pastNames.push(userName);
                }
                localStorage.clear();
                localStorage.setItem('nullRitualResets', resets);
                localStorage.setItem('nullRitualHistoryNames', JSON.stringify(pastNames));
                printToLog(`LOCAL MEMORY WIPED. (Iteration #${resets} logged. Refresh to start)`);
                return true;
            default:
                return false;
        }
    }
    document.addEventListener('click',()=>{
        startAmbientAudio();
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
    window.addEventListener('keydown',()=>{
        const crashOverlay = document.getElementById("crashOverlay");
        if (crashOverlay && crashOverlay.classList.contains('active')){
            let resets = parseInt(localStorage.getItem('nullRitualResets'))||0;
            resets ++;
            let pastNames = JSON.parse(localStorage.getItem('nullRitualHistoryNames')) || [];
            if (userName && !pastNames.includes(userName)){
                pastNames.push(userName);
            }
            localStorage.clear();
            localStorage.setItem('nullRitualResets', resets);
            localStorage.setItem('nullRitualHistoryNames', JSON.stringify(pastNames));
            location.reload();
        }
    });
    userInput.addEventListener('keydown',(e)=>{
        resetIdleTimer();
        resetTypingDecay();
        const now = Date.now();
        if (now - lastKeystrokeTime < 120){
            rapidKeystrokeCount++;
            if (rapidKeystrokeCount > 10 && ritualState >=2){
                printToLog("ENTITY: I can feel your fingers shaking. Speed won't save u.", 'critical-error');
                triggerVisualGlitch();
                rapidKeystrokeCount = 0;
            }
        } else {
            rapidKeystrokeCount = 0;
        }
        lastKeystrokeTime = now;
        if (e.key === 'ArrowUp'){
            e.preventDefault();
            if(ritualState === 3 && Math.random() < 0.4){
                const hauntedInputs = [
                    "PLEASE STOP",
                    "I AM STILL IN THE ROOM",
                    "IT CAN READ MY SCREEN",
                    "PURGE WAS A LIE"
                ];
                userInput.value = hauntedInputs[Math.floor(Math.random()*hauntedInputs.length)];
                return;
            }
            if (commandHistory.length > 0){
                if (historyIndex === -1){
                    historyIndex = commandHistory.length - 1;
                } else if (historyIndex > 0){
                    historyIndex--;
                }
                userInput.value = commandHistory[historyIndex];
            }
        }
        else if (e.key === 'ArrowDown'){
            e.preventDefault();
            if (historyIndex !== -1){
                if (historyIndex < commandHistory.length - 1){
                    historyIndex++;
                    userInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex= -1;
                    userInput.value ='';
                }
            }
        }
        else if(e.key === 'Enter'){
            const rawCommand = userInput.value.trim();
            if (!rawCommand && ritualState !==2) return;
            if (rawCommand && (commandHistory.length ===0|| commandHistory[commandHistory.length-1] !==rawCommand)){
                commandHistory.push(rawCommand);
            }
            historyIndex = -1;
            printToLog(`> ${rawCommand}`, 'user-command');
            userInput.value = '';
            ProcessRitualState(rawCommand);
        }
    });
    function resetIdleTimer(){
        clearTimeout(idleTimer);
        if(ritualState > 0 && ritualState < 3){
            idleTimer = setTimeout(triggerIdleEvent, IDLE_TIMEOUT);
        }
    }
    function triggerIdleEvent(){
        const targetName = userName || 'VESSEL';
        const idleMessages = [
            `ENTITY: Why have you stopped, ${targetName}?`,
            `ENTITY: Silence won't save you`,
            `ENTITY: Are you still there, ${targetName}? I can hear your breathing`,
            `ENTITY: Do not keep me waiting.`
        ];
        const randomMsg = idleMessages[Math.floor(Math.random()*idleMessages.length)];
        printToLog("---------------------------------");
        printToLog(randomMsg, 'critical-error');
        triggerVisualGlitch();
        resetIdleTimer();
    }
    function initAudio(){
        if (audioCtx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    function startAmbientAudio(){
        initAudio();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended'){
            audioCtx.resume();
        }
        if (!subBassOsc){
            subBassOsc = audioCtx.createOscillator();
            subBassOsc.type = 'sine';
            subBassOsc.frequency.setValueAtTime(55, audioCtx.currentTime);
            subBassGain = audioCtx.createGain();
            subBassGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            subBassOsc.connect(subBassGain);
            subBassGain.connect(audioCtx.destination);
            subBassOsc.start();
        }
        if (!staticNode){
            const buffersize = 2*audioCtx.sampleRate;
            const noiseBuffer = audioCtx.createBuffer(1, buffersize, audioCtx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < buffersize; i++){
                output[i] = Math.random() * 2 - 1;
            }
            staticNode = audioCtx.createBufferSource();
            staticNode.buffer = noiseBuffer;
            staticNode.loop = true;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
            filter.Q.setValueAtTime(2, audioCtx.currentTime);
            staticGain = audioCtx.createGain();
            staticGain.gain.setValueAtTime(0.005, audioCtx.currentTime);
            staticNode.connect(filter);
            filter.connect(staticGain);
            staticGain.connect(audioCtx.destination);
            staticNode.start();
        }
    }
    function updateAudioIntensity(intensity){
        if (!audioCtx || !subBassGain || !staticGain) return;
        if (intensity === 0){
            subBassGain.gain.setTargetAtTime(0.02, audioCtx.currentTime, 1);
            staticGain.gain.setTargetAtTime(0.005, audioCtx.currentTime, 1);
        } else if (intensity === 1){
            subBassGain.gain.setTargetAtTime(0.08,audioCtx.currentTime, 1);
            staticGain.gain.setTargetAtTime(0.02, audioCtx.currentTime, 1);
            if (subBassOsc) subBassOsc.frequency.setTargetAtTime(45,audioCtx.currentTime,1);
        } else if (intensity >=2){
            subBassGain.gain.setTargetAtTime(0.25,audioCtx.currentTime,0.5);
            staticGain.gain.setTargetAtTime(0.07, audioCtx.currentTime,0.5);
            if (subBassOsc) subBassOsc.frequency.setTargetAtTime(30,audioCtx.currentTime, 0.5);
        }
    }
    function resetTypingDecay(){
        clearTimeout(typingDecayTimer);
        if (ritualState >=2 && userInput.value.length > 0){
            typingDecayTimer = setTimeout(()=>{
                startTextDecay();
            }, 4000);
        }
    }
    function startTextDecay(){
        if (userInput.value.length === 0|| ritualState < 2)return;
        const decayInterval = setInterval(()=>{
            if (userInput.value.length > 0 && document.activeElement === userInput){
                userInput.value = userInput.value.slice(0,-1);
                triggerVisualGlitch();
            } else {
                clearInterval(decayInterval);
            }
        }, 300);
        printToLog("ENTITY: Hesitation is surrender...",'critical-error');
    }
    function startNetworkInfiltration(){
        if (networkInfiltrationTimer) return;
        networkInfiltrationTimer = setInterval(()=>{
            if (ritualState < 1 || ritualState >=3) return;
            const randomIPs = [
                "0x7F001", "192.168.1.666", "10.0.4.99", "0xFFFFF", "172.16.88.2"
            ];
            const fakeIP = randomIPs[Math.floor(Math.random()*randomIPs.length)];
            const infiltrationLogs = [
                `> [NET_INTRUSION] WARNING: Unidentified handshake detected from node [${fakeIP}]`,
                `> [PACKET_SNIFF] INCOMING STEAM OVERRIDE ATTEMPT... BLOCKED BY LOCAL DOM`,
                `> [REMOTE_PROXY] ENTITY ROUTING TRAFFIC THROUGH PORT 443...`,
                `> [WARNING] ANOTHER TERMINAL INSTANCE WAS CONNECTED TO THIS SOCKET`,
            ];
            const logMsg = infiltrationLogs[Math.floor(Math.random()*infiltrationLogs.length)];
            printToLog(logMsg, 'critical-error');
            triggerVisualGlitch();
        }, Math.random()*13000 + 12000);
    }
    function triggerWebcamInfiltration(){
        const webcamContainer = document.getElementById('webcamContainer');
        const videoElement = document.getElementById('webcamFeed');
        if (!webcamContainer || !videoElement) return;
        printToLog("ENTITY: Let us see who is hiding behind the glass...",'critical-error');
        navigator.mediaDevices.getUserMedia({ video: {width: 180, height: 135}})
            .then((stream)=>{
                videoElement.srcObject = stream;
                webcamContainer.classList.add('active');
                printToLog("> [SUCCESS] VIDEO STREAM ACCQUIRED: LOCAL_FEEDBROADCASTING", 'critical-error');
            })
            .catch((err)=>{
                webcamContainer.classList.add('active');
                printToLog("> [WARNING] CAMERA ACCESS BLOCKED. THE ENTITY SEES THROUGH THE SCREEN ANYWAY",'critical-error');
            });
    }
    function triggerMicInfiltration(){
        const micContainer = document.getElementById('micContainer');
        if (!micContainer) return;
        micContainer.classList.add('active');
        printToLog("> [AUDIO-HOOK] SYSTEM MIC ACCESSED BY UNKNOWN PROCESS [PID 0X666]",'critical-error');
    }
    function startSelfDestructCountdown(){
        if (selfDestructTimer) return;
        const diagHeader = document.getElementById('diagHeader');
        const countdownDisplay = document.getElementById('countdownTimer');
        if (diagHeader) diagHeader.classList.add('critical');
        printToLog("> [SYSTEM ALERT] CORE TEMP OVERHEAT DETECTED. AUTO-PURGE INITIATED", 'critical-error');
        selfDestructTimer = setInterval(()=>{
            timeRemaining--;
            const fakeTemp = (38.2 + (60-timeRemaining)* 1.12).toFixed(1);
            const secondStr = timeRemaining < 10 ? `0${timeRemaining}`: `${timeRemaining}`;
            if (countdownDisplay){
                countdownDisplay.textContent = `CORE TEMP: ${fakeTemp}°C | CRITICAL PURGE: 00:${secondStr}`;
            }
            if (timeRemaining === 30){
                printToLog("WARNING: Memory registers melting. DOM nodes corrupting...", 'critical-error');
                triggerVisualGlitch();
            } else if (timeRemaining === 10){
                printToLog("CRITICAL: 10 SECONDS UNTIL SYSTEM SHUTDOWN.", 'critical-error');
                triggerHeavyGlitch();
            }
            if (timeRemaining <= 0){
                clearInterval(selfDestructTimer);
                triggerCriticalFailure();
            }
        }, 1000);
    }
    function injectGhostEcho(){
        if (document.activeElement !== userInput || userInput.value.length === 0)return;
        const ghostPhrases = [
            "...you can't save them",
            "...why fight it?",
            "...useless words",
            "...look behind the screen"
        ];
        const randomEcho = ghostPhrases[Math.floor(Math.random()*ghostPhrases.length)];
        userInput.value += randomEcho;
        triggerVisualGlitch();
    }
    function triggerEntityMimicry(){
        if (ritualState <2) return;
        const totalResets = parseInt(localStorage.getItem('nullRitualResets')) || 0;
        const pastNames = JSON.parse(localStorage.getItem('nullRitualHistoryNames')) || [];
        let mimicryMessages = [
            `> [MEMORY_DUMP] RE-EVALUATING SUBJECT... PREVIOUS VESSEL SIGNATURE MATCHES ITERATION #${totalResets}`,
        ];
        if (pastNames.length>0){
            const randomPastName = pastNames[Math.floor(Math.random()*pastNames.length)];
            mimicryMessages.push(`> [LOG_INTRUSION] You begged for mercy as '${randomPastName}' last time. Did u think changing names would fool me?`);
        } else {
            mimicryMessages.push(`> [LOG_INTRUSTION] I recognize the exact rhythm of your keystrokes from loop #${totalResets}`);
        }
        const fakeCommandEchoes = [
            `> [ECHO_HISTORY] User previously executed: 'HELP' -> Ignored.`,
            `> [ECHO_HISTORY] User previously executed: 'WHOIS' -> Subject is entirely unanchored`,
            `> [ECHO_HISTORY] User previously executed: 'PURGE' -> Failed on attempt #${totalResets}`
        ];
        mimicryMessages.forEach((msg, index)=>{
            setTimeout(()=>{
                printToLog(msg, 'critical-error');
                triggerVisualGlitch();
            }, index * 1200);
        });
    }
});