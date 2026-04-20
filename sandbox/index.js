const csp = `http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-src 'none'; child-src 'none';"`
const sandbox = document.getElementById('sandbox');
const regexFormat = '(↝\\\\*\\\/\\")(horizontal)(\\"\\\/\\\\*\\↝)';
const regexExport = '(↙\\\\*\\\/)(false)(\\\/\\\\*\\↙)';
const regexCode = '(↡\\\\*\\\/\\")()(\\"\\\/\\\\*\\↡)';
const regexHeight = '(⤦\\\\*\\\/)(0)(\\\/\\\\*\\⤦)';
const regexSectionWidth = '(⤧\\\\*\\\/)(0)(\\\/\\\\*\\⤧)';
const urlParams = new URLSearchParams(window.location.search);
const formatParam = urlParams.get('format');
const format = (formatParam === 'v' || formatParam === 'vert' || formatParam == 'vertical') ? 'vertical' : 'horizontal';
const allowExportParam = urlParams.get('export');
const allowExport = (allowExportParam === 't' || allowExportParam === 'true' || allowExportParam == 'yes');
const allowExportString = allowExport ? 'true' : 'false';
const iframeAllow = allowExport ? 'clipboard-write' : '';
const intialCodeParam = urlParams.get('code') ?? "";
const intialCode = encodeURIComponent(intialCodeParam).replace(/'/g, "%27").replace(/"/g, "%22"); // encode quotation marks to prevent string from breaking when inserted
const editorHeight = urlParams.get('height') ?? 0;
const editorWidthsParam = urlParams.get('section-widths') ?? "0";
const editorWidthsMatches = (/(\d+),(\d+),(\d+)/gm).exec(editorWidthsParam);
const editorWidths = editorWidthsMatches?.length >= 4 ? `[${editorWidthsMatches[1]}, ${editorWidthsMatches[2]}, ${editorWidthsMatches[3]}]` : 0;
const parentOriginParam = urlParams.get('parent-origin') ?? null;
const parentOrigins = parentOriginParam !== null ? [parentOriginParam] : [];

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
                    const regexHeight = new RegExp('${regexHeight}', 'gm');
                    const regexSectionWidth = new RegExp('${regexSectionWidth}', 'gm');
                    sandbox.srcdoc = glowscriptHTML
                        .replace(regexFormat,'$1${format}$3')
                        .replace(regexExport,'$1${allowExportString}$3')
                        .replace(regexCode,'$1${intialCode}$3')
                        .replace(regexHeight, '$1${editorHeight}$3')
                        .replace(regexSectionWidth, '$1${editorWidths}$3');
                };
                xhr.open("GET", "GlowScript.txt");
                xhr.send();

                window.addEventListener('message', (e)=>{
                    if(e?.data?.type === 'load' && e?.origin === 'null'){
                        sandbox.contentWindow.postMessage({type:'load', content: e.data.content}, '*');
                    } else if(e?.data?.type === 'save' && e?.origin === 'null'){
                        window.parent.postMessage({type: 'save', content: e.data.content}, '*');
                    } else if(e?.data?.origin === 'init' && e?.origin === 'null'){
                        window.parent.postMessage({type:'init'});
                    }
                });
            </script>
        </ body>
        </html>`
sandbox.srcdoc = srcdoc;

window.addEventListener('message', (e) => {
    if (e?.data?.type === 'load' && parentOrigins.indexOf(e?.origin) !== -1) {
        sandbox.contentWindow.postMessage({ type: 'load', content: e.data.content }, '*');
    } else if (e?.data?.type === 'save' && e?.origin === 'null') {
        window.parent.postMessage({ type: 'save', content: e.data.content }, '*');
    } else if (e?.data?.origin === 'init' && e?.origin === 'null') {
        window.parent.postMessage({ type: 'init' });
    }
});