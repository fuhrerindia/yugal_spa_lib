const YugalVars = {
  root: document.getElementById("yugal-root"),
  yugalHeadComment: `<!-- DO NOT DELETE THIS COMMENT! THIS COMMENT IS VERY IMPORTANT FOR YUGAL TO WORK! -->`,
  pageNum: 1,
  importedCss: 0,
};
var page = {};
function navigate_to_path({
  willMount,
  onMount,
  render,
  uri,
  historyTitle,
  css,
  willUnMount,
  onUnMount,
}) {
  page = {};
  yugal.currentDestroy();

  if (willUnMount !== undefined) {
    yugal.currentDestroy = willUnMount;
  } else {
    yugal.currentDestroy = () => {};
  }
  if (css !== undefined) {
    document.getElementById("yugal-page-specific-style").innerHTML = css;
  } else {
    document.getElementById("yugal-page-specific-style").innerHTML = "";
  }
  historyTitle = !historyTitle ? uri : historyTitle;
  if (willMount !== undefined) {
    willMount();
  }
  if (render !== undefined) {
    if ((YugalVars.root.innerHTML = render)) {
      if (onMount !== undefined) {
        onMount();
      }
    } else {
      console.error("COMPILATION ERROR");
    }
  } else {
    console.error("COMPILATION ERROR");
  }
  if (uri !== undefined) {
    history.pushState({ urlPath: `./${uri}` }, historyTitle, `./${uri}`);
    YugalVars.pageNum++;
  }
  const elements = document.querySelectorAll("[to]");
  elements.forEach((element) => {
    let toValue = element.getAttribute("to");
    if (element.getAttribute("onclick") !== null) {
      toValue_past = element.getAttribute("onclick");
    } else {
      toValue_past = "";
    }
    if (toValue_past.replaceAll(" ") === "") {
      toValue = `yugal.link("${toValue}");`;
    } else {
      toValue = `${toValue_past};yugal.link("${toValue}");`;
    }
    toValue = toValue.replaceAll(";;", ";");
    element.setAttribute("onclick", toValue);
    element.removeAttribute("to");
  });
  yugal.afterDestroyed();
  if (onUnMount !== undefined) {
    yugal.afterDestroyed = onUnMount;
  } else {
    yugal.afterDestroyed = () => {};
  }
}
const yugal = {
  production: () => {
    console.log(
      "%cThis is a browser feature intended for developers. Do not enter anything here.",
      "background:black ;color: white; font-size: x-large"
    );
    console = {
      log: () => {},
      error: () => {},
      warn: () => {},
    };
    eval = () => {};
    YugalErrorPage = () => {
      return {};
    };
  },
  afterDestroyed: () => {},
  navigate: (props) => {
    navigate_to_path(props);
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
          `;
      document.getElementsByTagName("head")[0].innerHTML = `${siteCredential}${
        YugalVars.yugalHeadComment
      }${headTag.split(YugalVars.yugalHeadComment)[1]}`;
    }
  },
  header: (code) => {
    let headCodeSplit = document
      .getElementsByTagName("head")[0]
      .innerHTML.split(YugalVars.yugalHeadComment);
    document.getElementsByTagName(
      "head"
    )[0].innerHTML = `${headCodeSplit[0]}${YugalVars.yugalHeadComment}${code}`;
  },
  knownPath: {},
  link: (pathname) => {
    function VirtualPage() {
      return yugal.knownPath[pathname]();
    }
    yugal.navigate(VirtualPage());
  },
  currentDestroy: () => {},
  router: ({ initial, error404, screens }) => {
    screens.forEach((i) => {
      obj = i();
      uri = obj.uri;
      yugal.knownPath[`/${uri}`] = i;
    });
    function dothis() {
      let init = initial == undefined ? screens[0].page : initial;
      const uri = window.location.href;
      let req = uri.split("/");
      req = req[req.length - 1];
      if (req === "") {
        yugal.navigate(init());
      } else {
        const svar = screens.find((scrn) => {
          return scrn().uri === req;
        });
        if (svar == undefined) {
          if (error404 == undefined) {
            console.error("PAGE NOT FOUND");
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
    };
  },
  include: (file) => {
    var script = document.createElement("script");
    script.src = file;
    script.type = "text/javascript";
    document.getElementsByTagName("body").item(0).appendChild(script);
  },
  call: (file) => {
    var script = document.createElement("script");
    script.src = `./modules/${file}/index.js`;
    script.type = "text/javascript";
    document.getElementsByTagName("body").item(0).appendChild(script);
  },
  files: (array) => {
    array.map((item) => {
      yugal.include(item);
    });
  },
  kebabize: (str) => {
    return str
      .split("")
      .map((letter, idx) => {
        return letter.toUpperCase() === letter
          ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
          : letter;
      })
      .join("");
  },
  style: (obj) => {
    des = "";
    Object.keys(obj).forEach(function (nkey) {
      end = "";
      if (typeof obj[nkey] === "number") {
        end = `${obj[nkey]}px;`;
      } else {
        end = `${obj[nkey]};`;
      }
      des = des + "" + yugal.kebabize(nkey) + ":" + end;
    });
    return des;
  },
  css: (props, name) => {
    if (typeof props !== "string") {
      props = yugal.style(props);
    }
    yugal_style = document.getElementById("yugal-style");
    yugal_style.innerHTML = `${yugal_style.innerHTML}${name}{${props}}`;
  },
  $: (key) => document.querySelector(key),
  StyleSheet: {
    create: (css, beg) => {
      beg = !beg ? "" : beg;
      final_css = "";
      Object.keys(css).map((key) => {
        this_props = `${beg}${key}{`;
        Object.keys(css[key]).map((prop) => {
          prop_val =
            typeof css[key][prop] === "number"
              ? `${String(css[key][prop])}px`
              : css[key][prop];
          this_props = `${this_props}${yugal.kebabize(prop)}:${prop_val};`;
        });
        this_props = this_props + `} `;
        final_css = final_css + this_props;
      });
      return final_css;
    },
    inject: (css_string) => {
      document.getElementById("yugal-style").innerHTML = `${
        document.getElementById("yugal-style").innerHTML
      }${css_string}`;
    },
    import: (url, id) => {
      id = !id ? `yugal_imported_css${YugalVars.importedCss}` : id;
      headcode = document.getElementsByTagName("head")[0].innerHTML;
      headcode = headcode.split(YugalVars.yugalHeadComment);
      headcode[0] = `<link rel="stylesheet" href="${url}" id="${id}">${headcode[0]}`;
      document.getElementsByTagName(
        "head"
      )[0].innerHTML = `${headcode[0]}${YugalVars.yugalHeadComment}${headcode[1]}`;
      YugalVars.importedCss = YugalVars.importedCss + 1;
      return document.getElementById(id);
    },
  },
};
const html = (code) => code;
