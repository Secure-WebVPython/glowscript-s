const csp = `http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-src 'none'; child-src 'none';"`
const sandbox = document.getElementById('sandbox');
const regex = '(↝\\\\*\\\/\\")(horizontal)(\\"\\\/\\\\*\\↝)';
const urlParams = new URLSearchParams(window.location.search);
const formatParam = urlParams.get('format');
const format = (formatParam === 'v' || formatParam === 'vert' || formatParam == 'vertical') ? 'vertical' : 'horizontal';

const srcdoc = `
    <!DOCTYPE html>
        <html style="height:100%; overflow:hidden;">
        <head>
            <meta ${csp}>
        </head>
        <body style="border:none; margin:0px; width:100%; height:100%">
            <iframe id="sandbox" sandbox="allow-scripts" style="border:none; width:100%; height:100%"></iframe>
            <script>
                const sandbox = document.getElementById('sandbox');
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    const glowscriptHTML = xhr.response;
                    sandbox.src = "about:srcdoc";
                    const regex = new RegExp('${regex}', 'gm');
                    sandbox.srcdoc = glowscriptHTML.replace(regex,'$1${format}$3');
                };
                xhr.open("GET", "GlowScript.txt");
                xhr.send();
            </script>
        </ body>
        </html>`
sandbox.srcdoc = srcdoc;