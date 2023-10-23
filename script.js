gsap.config({ trialWarn: false });
gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#main",
        start: "top top",
        scrub: 2,
    },
});

gsap.to(".hero-img", {
    duration: 1.5,
    scale: 1,
    x: -50,
    delay: 1,
});

// ------------ handling parallax effect --------------------

const elements = gsap.utils.toArray(".parallax");
elements.forEach((elem) => {
    const depth = elem.dataset.depth;

    const shifting = -(depth * (elem.offsetHeight * 1.1));

    tl.to(
        elem,
        {
            y: shifting,
            ease: "easeInOut",
        },
        0
    );
    gsap.to(".dark-bg", {
        scrollTrigger: {
            trigger: "#main",
            start: "30% top",
            end: "40% top",
            scrub: "1",
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        ease: "power1.in",
    });
});

// ------------ slider animation --------------------

const imagesArray = [
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/1f6a1ab13e0e6ebc832297300b88c334165ab4f2-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/553027dba526fc5f149d7d4c8d928f8b9f740b5d-822x1095.jpg?w=822&h=1095&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/3fe988fac9e77b0011276bdcbeebfd0af15400e5-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/d322ea6dbe1fa482a8802e950d921ebda0db8f04-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/00214d8d97cef9e575f90b9816e722b5e62d609c-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/da56210f2e06805cc01610c067b5fdc0c0aa2e47-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/b127b3f20dab7599e1e8d48d534bd4ab0c5a5914-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/5a9a65768111907c9ad9ca9b81ab1332c027f49f-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
    {
        url: "https://cdn.sanity.io/images/cgu626el/production/73ecf513737f2f764929b33946c7be9a0ad50ca5-822x1096.jpg?w=822&h=1096&q=90&auto=format",
    },
];

const cards_container = document.querySelector(".slider-inner");

// rendering cards
imagesArray.forEach((cardData, idx) => {
    cards_container.innerHTML += `
        <div class="slide">
            <div className="slide-proxy"></div>  
            
            <div class="slide-img">
                <img src=${cardData.url}>
            </div>
        </div>
    `;
});

const container = document.querySelector(".slider-container");
const proxy = container.querySelector(".proxy");
const slider = document.querySelector(".slider-inner");
const slides = [...container.querySelectorAll(".slide")];

let sliderWidth = 0;
let pressedTop = false;
let offset = 0;

const setBounds = () => {
    sliderWidth = slides[0].offsetWidth * slides.length;
    gsap.to([slider, proxy], { width: sliderWidth, x: "+=0" });
};

setBounds();

// drag working
const draggable = Draggable.create(proxy, {
    type: "x",
    bounds: container,
    throwProps: true,

    edgeResistance: 1,
    dragResistance: 0.4,

    onPress: function (e) {
        var bounds = this.target.getBoundingClientRect();
        pressedTop = e.clientY < bounds.y + bounds.height / 2;

        if (bounds.x > 700) {
            document.querySelector(".slider-text-container").style.opacity = 1;
        } else {
            document.querySelector(".slider-text-container").style.opacity = 0;
        }

        offset = this.x - gsap.getProperty(proxy, "x");

        gsap.killTweensOf(slider); //in case it's moving
        gsap.to(slider, { skewX: 0, duration: 0.2 });
    },
    onDrag: function () {
        var bounds = this.target.getBoundingClientRect();

        if (bounds.x > 700) {
            document.querySelector(".slider-text-container").style.opacity = 1;
        } else {
            document.querySelector(".slider-text-container").style.opacity = 0;
        }

        gsap.to(slider, {
            duration: 0.8,
            x: this.x - offset,
            skewX: function (v) {
                var skew = InertiaPlugin.getVelocity(proxy, "x") / 200;

                return gsap.utils.clamp(-30, 30, skew);
            },
            overwrite: "auto",
            ease: "power3",
        });
    },
    onRelease: function () {
        var bounds = this.target.getBoundingClientRect();

        if (bounds.x > 700) {
            document.querySelector(".slider-text-container").style.opacity = 1;
        } else {
            document.querySelector(".slider-text-container").style.opacity = 0;
        }

        let velocity = InertiaPlugin.getVelocity(proxy, "x");
        if (this.tween && Math.abs(velocity) > 20) {
            gsap.to(slider, {
                overwrite: "auto",
                inertia: {
                    x: {
                        velocity: velocity,
                        end: this.endX,
                    },
                },
            });
        }

        gsap.to(slider, { skewX: 0, duration: 0.5, overwrite: "auto" });
    },
});

//------------- curser logic --------------------

const cursor = document.querySelector("#cursor");
const slider_section = document.querySelector(".slider-section");

slider_section.addEventListener("mouseenter", () => {
    cursor.style.display = "flex";
});

slider_section.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
});

slider_section.addEventListener(
    "mousemove",
    (e) => {
        let sliderTop = slider_section.getBoundingClientRect().top;
        let sliderLeft = slider_section.getBoundingClientRect().left;

        if (!e.target.classList.contains("proxy")) {
            document.querySelector("#cursor").innerHTML = "Click";
            document.querySelector("#cursor").style.mixBlendMode = "soft-light";
        } else {
            document.querySelector("#cursor").innerHTML = "< Drag >";
            document.querySelector("#cursor").style.mixBlendMode = "normal";
        }

        document.querySelector("#cursor").style.top =
            e.clientY - 40 - sliderTop + "px";
        document.querySelector("#cursor").style.left =
            e.clientX - 40 - sliderLeft + "px";
    },
    true
);
