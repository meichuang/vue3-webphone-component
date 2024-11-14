import JsSIP from 'jssip';

let userAgent;

document.addEventListener('DOMContentLoaded', () => {
    console.log('User agent initialized');

    const socket = new JsSIP.WebSocketInterface('ws://localhost:8888');
        
    const configuration = {
    sockets  : [ socket ],
    uri      : 'sip:1001@localhost',
    password : '1001',
    session_timers: false
    };
    
    userAgent = new JsSIP.UA(configuration);
    
    
    function handleIncomingCall(session) {
        // 例如，弹出一个通知或显示一个对话框让用户选择是否接听
        const answerCall = confirm('您有一个来电，是否接听？');
    
        if (answerCall) {
            // 接听电话
            session.answer();
    
            session.on('progress', (response) => {
                console.log('呼叫正在建立中');
            });
    
            session.on('confirmed', (response) => {
                console.log('呼叫已确认');
            });
    
            session.on('failed', (response, cause) => {
                console.log('呼叫失败:', cause);
            });
        } else {
            // 拒绝电话
            session.reject();
        }
    }

    document.getElementById('register').onclick = () => {
        console.log('Registering...');

        userAgent.on('registered', (e) => {
            console.log('Registered');
        });

        userAgent.on('unregistered', (e) => {
            console.log('Unregistered');
        });

        userAgent.on('registrationFailed', (e) => {
            console.error('Registration failed:', e);
            debug;
        }); 
 
           //处理入呼
        userAgent.on('newRTCSession', (session) => {
            console.log('========>New session:', session);
            
                if (session.session.direction === 'outgoing') {
                console.log('这是一个呼出会话');
                // 处理呼出会话的逻辑
            } else if (session.session.direction === 'incoming') {
                console.log('这是一个呼入会话');
                handleIncomingCall(session.session);

            }

        }); 
        
        userAgent.start();
    };

    document.getElementById('call').onclick = () => {
        if (userAgent) {
            // Register callbacks to desired call events
            var eventHandlers = {
                'progress':   function(data){ console.log('Call is in progress'); },
                'failed':     function(data){ console.error('Call failed:', data); },
                'confirmed':  function(data){ console.log('Call accepted'); },
                'ended':      function(data){ console.log('Call ended'); }
            };

            var options = {
                'eventHandlers': eventHandlers,
                'extraHeaders': [ 'X-Foo: foo', 'X-Bar: bar' ],
                'mediaConstraints': {'audio': true, 'video': false}
              };
              
            console.log('Call 1002');
            
            const session = userAgent.call('1002', options);
            // session.on('progress', (e) => {
            //     console.log('Call is in progress');
            // });
            // session.on('confirmed', (e) => {
            //     console.log('Call accepted');
            // });
            // session.on('failed', (e) => {
            //     console.error('Call failed:', e);
            // });
        } else {
            console.error('User agent is not initialized');
        }
    };

    document.getElementById('hangup').onclick = () => {
        if (userAgent) {
            userAgent.stop();
        } else {
            console.error('User agent is not initialized');
        }
    };
});