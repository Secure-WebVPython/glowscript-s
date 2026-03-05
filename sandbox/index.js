const csp = `http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-src 'none'; child-src 'none';"`
const sandbox = document.getElementById('sandbox');
const regexFormat = '(↝\\\\*\\\/\\")(horizontal)(\\"\\\/\\\\*\\↝)';
const regexExport = '(↙\\\\*\\\/)(false)(\\\/\\\\*\\↙)';
const regexCode = '(↡\\\\*\\\/\\")()(\\"\\\/\\\\*\\↡)';
const urlParams = new URLSearchParams(window.location.search);
const formatParam = urlParams.get('format');
const format = (formatParam === 'v' || formatParam === 'vert' || formatParam == 'vertical') ? 'vertical' : 'horizontal';
const allowExportParam = urlParams.get('export');
const allowExport = (allowExportParam === 't' || allowExportParam === 'true' || allowExportParam == 'yes');
const allowExportString = allowExport ? 'true' : 'false';
const iframeAllow = allowExport ? 'clipboard-write' : '';
const intialCodeParam = urlParams.get('code') ?? "";
const intialCode = encodeURI(intialCodeParam);

const srcdoc = `
    <!DOCTYPE html>
        <html style="height:100%; overflow:hidden;">
        <head>
            <meta ${csp}>
        </head>
        <body style="border:none; margin:0px; width:100%; height:100%">
            <iframe id="sandbox" sandbox="allow-scripts" allow="${iframeAllow}" style="border:none; width:100%; height:100%"></iframe>
            <script>
                const sandbox = document.getElementById('sandbox');
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    const glowscriptHTML = xhr.response;
                    sandbox.src = "about:srcdoc";
                    const regexFormat = new RegExp('${regexFormat}', 'gm');
                    const regexExport = new RegExp('${regexExport}', 'gm');
                    const regexCode = new RegExp('${regexCode}', 'gm');
                    sandbox.srcdoc = glowscriptHTML
                        .replace(regexFormat,'$1${format}$3')
                        .replace(regexExport,'$1${allowExportString}$3')
                        .replace(regexCode,'$1${intialCode}$3');
                };
                xhr.open("GET", "GlowScript.txt");
                xhr.send();
            </script>
        </ body>
        </html>`
sandbox.srcdoc = srcdoc;