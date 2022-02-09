$(function() {
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
        homeAni(".container", 0, null);
    } else if (window.location.pathname === "/about.html") {
        aboutAni(".container", 0, 0.5, null);
    } else if (window.location.pathname === "/contact.html") {
        contactAni(".container", 0, 0.5, null);
    };

    $(".page-link").on("click", function(event) {
        event.preventDefault();
        overlayOff();
        if (window.location.href === this.href) {
            return;
        }
        history.pushState(null, null, this.href);
        changePage();
    });

    window.addEventListener('popstate', function() {
        overlayOff();
        changePage();
    });
    $(".burger").on("click", overlayToggle);
});

function overlayOn() {
    gsap.set(".burger .top", {y: 0});
    gsap.set(".burger .bottom", {y: 0});
    gsap.set("body", {overflow: "hidden"});
    gsap.to(".overlay", {opacity:1, display:"block", ease:"none"});
    gsap.to(".burger .center", {rotation: 360, scaleX: 0})
    gsap.to(".burger .top", {rotation: 45, y: 12, scaleX: 1.3});
    gsap.to(".burger .bottom", {rotation: -45, y: -12, scaleX: 1.3});
    gsap.fromTo(".overlay li", {opacity: 0, y: -100}, {opacity: 1, y: 0, stagger: 0.1, delay: 0.5});
}

function overlayOff() {
    gsap.fromTo(".overlay li", {opacity: 1, y: 0}, {opacity: 0, y: -100, stagger: 0.1});
    gsap.to(".burger .center", {rotation: 0, scaleX: 1});
    gsap.to(".burger .top", {rotation: 0, y: 24, scaleX: 1});
    gsap.to(".burger .bottom", {rotation: 0, y: -24, scaleX: 1});
    gsap.to(".overlay", {opacity:0, display:"none", delay: 0.5, ease: "none"});
    gsap.set("body", {overflow: "visible", delay: 0.5});
}

function overlayToggle() {
    if ($(".overlay").css("display") === "block") {
        overlayOff();
    } else {
        overlayOn();
    }
}

function pageChange(path) {
    let p = path;
    overlayOff();
    gsap.to(".container", {opacity: 0, duration: 1});
    setTimeout(function() {
        window.location.href = p;
    }, 1000);
}

function loadPage(url) {
    let cache = {};
    if (cache[url]) {
        return new Promise(function(resolve) {
          resolve(cache[url]);
        });
      }
    
      return fetch(url, {
        method: 'GET'
      }).then(function(response) {
        cache[url] = response.text();
        return cache[url];
      });
    }

function changePage() {
    let main = document.querySelector("main");
    let url = window.location.href;
    let wrapper = document.createElement("div");

    loadPage(url).then(function(responseText) {
        wrapper.innerHTML = responseText;

        let oldContent = document.querySelector(".container");
        let newContent = wrapper.querySelector(".container")

        main.appendChild(newContent);
        pageTrans(oldContent, newContent);
    })
}

function pageTrans(oldContent, newContent) {
    if (window.innerWidth >1000){
        gsap.set(oldContent, {position: "absolute", left: 0, paddingLeft: "100px"});
    } else {
        gsap.set(oldContent, {position: "absolute", top: 0, paddingTop: "75px"});
    };
    gsap.to(oldContent, {opacity: 0, duration: 1});
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
        homeAni(newContent, 1, a1);
    } else if (window.location.pathname === "/about.html") {
        aboutAni(newContent, 1, 1, a1);
    } else if (window.location.pathname === "/contact.html") {
        contactAni(newContent, 1, 1, a1);
    };
    function a1() {
      oldContent.parentNode.removeChild(oldContent);
    };
  }

function homeAni(dest, del, onComp) {
    gsap.from(dest, {opacity: 0, duration: 1, delay: del, scale:0.8, ease: "slow", onComplete: onComp});
}

function aboutAni(dest, del1, del2, onComp) {
    gsap.from(dest, {opacity: 0, duration: 1, delay: del1, ease: "none", onComplete: onComp});
    gsap.from(".skills li", {duration: 2, scale: 0.5, opacity: 0, delay: del2, stagger: 0.2, ease: "elastic", force3D: true});
}

function contactAni(dest, del1, del2, onComp) {
    gsap.from(dest, {opacity: 0, duration: 1, delay: del1, ease: "none", onComplete: onComp});
    gsap.from(".social li", {duration: 2, scale: 0.5, opacity: 0, delay: del2, stagger: 0.2, ease: "elastic", force3D: true});
}