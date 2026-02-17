# Sandboxed Glowscript

A sandboxed version of a single-page glowscript editor is deployed on GitHub pages, where it can be embedded into pages where users shouldn't have open internet access. 

# Architecture

```
 index.html
    -> iframe srcdoc sandbox
        -> meta CSP
        -> iframe srcdoc=GlowScript.txt sandbox
                -> eval(user code)
```

The sandboxing works by using two iframes created with srcdoc. The upper iframe has a CSP to only allow content from 'self' and the lower iframe inherits the CSP and runs glowscript, including user code. The lower iframe cannot access the upper iframe to disable the CSP because both have the sandbox attribute without 'allow-same-origin'. Additionally, the lower iframe cannot create any iframes of its own with separate origins because of the policy frame-src 'none'. An exception is that about:blank is an allowed src, but the lower iframe isn't able to access the contentDocument of the blank iframe because they have different origins from the sandbox attribute.

The CSP used is 
```
default-src 'self' 'unsafe-inline' 'unsafe-eval';
frame-src 'none';
child-src 'none';
```

Because the default-src is 'self', anything on the origin, `<user|organization>.github.io` can be accessed by the sandboxed user code, hence requiring a dedicated user or organization with no other github pages deployments.

# Tested Attacks

## Override Meta & Insert Iframe

The idea is that a Content Security Policy can be declared in the `iframe srcdoc=GlowScript.txt sandbox` document or a child iframe, and an iframe can be embedded, where only the most direct CSP will be used. However, this does not work because with srcdoc iframes, and content appears to be checked by all ancestor CSPs.

## Serviceworker Hijack

If a serviceworker is registered, it may be able to load content from other sources. This is not possible because resources returned by serviceworkers are still checked against the CSP. Additionally, a serviceworker requires a url to locate the serviceworker file, and an eval-like string to execute javascript cannot be passed as the url.

## Cookies & LocalStorage

Information could be stored in cookies or local storage and accessed later. This is not possible because the code is executed in an iframe that has 'sandbox' without 'allow-same-origin', so cookies and local storage cannot be accessed.

# Local Development

The sandbox can be built locally by running:
> $ npm run build:sandbox

This pulls necessary files from `/sandbox` and `/GlowScriptOffline` folders and copies to `/dist-sandbox` folder. 
Local hosting can be achieved with live server, and the sandbox can be tested by navigating to `http://127.0.0.1:5500/dist-sandbox/`.

# GitHub Pages Deployment

The repository must be configured in Settings > Pages > Source to GitHub Actions.
The static.yaml file in .github/workflows is run when master is pushed to, and deploys code from the dist-sandbox folder  to `<user|organization>.github.io`

