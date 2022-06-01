function YugalErrorPage(title, error) {
    return {
        willMount: () => {
            console.error(error);
        },
        render: `
        <style>
            article{
                width:100vw;
                height: 100vh;
                background: red;
                text-align: center;
                overflow-y:auto;
            }
            section{
                width: 60%;
                height: 100vh;
                background: #000;
                display: inline-block; 
                text-align:left;
            }
            h1{
                margin: 50px;
                color: #ffffff;
            }
            div{
                width:100%;
                text-align:center;
            }
            pre{
                width: 90%;
                background: #404040;
                color:#fff;
                border-radius: 10px;
                padding: 10px;
                display:inline-block;
                line-height:25px;
                text-align:left;
            }
            button{
                padding:10px;
                border-radius: 10px;
                margin:10px;
                border:0;
                cursor:pointer;
                background:#34cceb;
                color:#000;
                transition:0.3s;
            }
            button:hover{
                background: #087f96;
                color:#fff
            }
        </style>
            <article>
                <section>
                    <h1>${title.toUpperCase()} ERROR</h1>
                    <div>
                    <pre>${error}</pre>
                    <br>
                    <a href=""><button>RELOAD</button></a>
                    <a href="https://spa.yugal.ml" target="_blank"><button>DOCS</button></a>
                    </div>
                </section>
            </article>
        `
    };
}
const YugalVars = {
    root: document.getElementById("yugal-root"),
    storageKey: "yugal-page-navigation-history",
    yugalHeadComment: `<!-- DO NOT DELETE THIS COMMENT! THIS COMMENT IS VERY IMPORTANT FOR YUGAL TO WORK! -->`,
    yugalErr: (error, type) => {
        yugal.navigate(YugalErrorPage(error, type));
    },
    pageNum: 1
};

const yugal = {
    production: () => {
        console.log('%cThis is a browser feature intended for developers. Do not enter anything here.', "background:black ;color: white; font-size: x-large");
        console = {
            log: () => { },
            error: () => { },
            warn: () => { }
        };
        eval = () => { }
        YugalErrorPage = () => { return {} }
    },
    navigate: ({ willMount, onMount, render, uri }) => {
        if (willMount !== undefined) {
            willMount();
        }
        if (render !== undefined) {
            if (YugalVars.root.innerHTML = render) {
                if (onMount !== undefined) {
                    onMount();
                }
            } else {
                yugal.navigate(YugalErrorPage("COMPILATION", `Could not Render component to DOM, You likely have not defined render component properly, check string-laterals. Skipped onMount LifeCycle method.`));

            }
        } else {
            yugal.navigate(YugalErrorPage("COMPILATION", `Could not find render method in component object.
Example Screen:
function SomePage(){
    return{
        onMount: ()=>{}, //LifeCycle Method
        willMount: ()=>{}, //LifeCycle Method
        render: '', //Body Code to render to body
        uri: '' //URI to push into browser
    };
}`));
        }
        if (uri !== undefined) {
            history.pushState({ page: YugalVars.pageNum }, uri, uri);
            YugalVars.pageNum++;
        }
    },
    title: (title) => {
        if (title !== undefined) {
            document.getElementsByTagName("title")[0].innerHTML = title;
            document.getElementsByTagName("meta").title.content = title;
            return true;
        } else {
            return document.getElementsByTagName("title")[0].innerHTML;
        }
    },
    meta: (title, content) => {
        if (document.getElementsByTagName("meta")[title] !== undefined) {
            document.getElementsByTagName("meta")[title].content = content;
        } else {
            let headTag = document.getElementsByTagName("head")[0].innerHTML;
            let siteCredential = headTag.split(YugalVars.yugalHeadComment)[0];
            siteCredential = `
                ${siteCredential}
                <meta name="${title}" content="${content}" />
            `
            document.getElementsByTagName("head")[0].innerHTML = `${siteCredential}${YugalVars.yugalHeadComment}${headTag.split(YugalVars.yugalHeadComment)[1]}`;
        }
    },
    header: (code) => {
        if (code == undefined) {
            YugalVars.yugalErr('SYNTAX', 'Can not find code to render in yugal.header method, you have to pass code as strings as parameter in yugal.header');
        } else {
            let headCodeSplit = document.getElementsByTagName("head")[0].innerHTML.split(YugalVars.yugalHeadComment);
            document.getElementsByTagName("head")[0].innerHTML = `${headCodeSplit[0]}${YugalVars.yugalHeadComment}${code}`;
        }
    },
    router: ({ initial, error404, screens }) => {
        function dothis() {
            let init = initial == undefined ? screens[0].page : initial;
            const uri = window.location.href;
            let req = uri.split("/");
            req = req[req.length - 1];
            if (req === "") {
                yugal.navigate(init());
            } else {
                const svar = screens.find(
                    (scrn) => {
                        return scrn().uri === req
                    }
                );
                if (svar == undefined) {
                    if (error404 == undefined) {
                        yugal.navigate(YugalErrorPage('404', `
                            HTTP Error 404, Page could not be found.
                        `));
                    } else {
                        yugal.navigate(error404());
                    }
                } else {
                    yugal.navigate(svar());
                }
            }
        }
        dothis();
        window.onpopstate = function (event) {
            dothis();
        }
    },
    include: (file) => {
        var script = document.createElement('script');
        script.src = file;
        script.type = 'text/javascript';
        document.getElementsByTagName('body').item(0).appendChild(script);
    },
    call: (file) => {
        var script = document.createElement('script');
        script.src = `./modules/${file}/index.js`;
        script.type = 'text/javascript';
        document.getElementsByTagName('body').item(0).appendChild(script);
    },
    files: (array) => {
        array.map((item) => {
            yugal.include(item);
        });
    },
    kebabize: str => {
        return str.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
                ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
                : letter;
        }).join('');
    },
    style: (obj) => {
        des = "";
        Object.keys(obj).forEach(function (nkey) {
            end = "";
            if (typeof obj[nkey] === 'number'){
                end = `${obj[nkey]}px;`;
            }
            else{
                end = `${obj[nkey]};`
            }
            des = des + "" + yugal.kebabize(nkey) + ":" + end;
        });
        return des;
    },
    css: (props, name)=>{
        if (typeof props !== 'string'){
            props = yugal.style(props);
        }
        yugal_style = document.getElementById("yugal-style");
        yugal_style.innerHTML = `${yugal_style.innerHTML}${name}{${props}}`
    } 
};
const html = (code) => code;
